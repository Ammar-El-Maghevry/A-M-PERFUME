package com.amperfume.api.service;

import com.amperfume.api.dto.request.SettingsUpdateRequest;
import com.amperfume.api.dto.response.DashboardResponse;
import com.amperfume.api.dto.response.OrderResponse;
import com.amperfume.api.dto.response.PageResponse;
import com.amperfume.api.dto.response.UserResponse;
import com.amperfume.api.entity.Order;
import com.amperfume.api.entity.SiteSettings;
import com.amperfume.api.entity.User;
import com.amperfume.api.enums.OrderStatus;
import com.amperfume.api.enums.Role;
import com.amperfume.api.exception.NotFoundException;
import com.amperfume.api.repository.OrderRepository;
import com.amperfume.api.repository.ProductRepository;
import com.amperfume.api.repository.SiteSettingsRepository;
import com.amperfume.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private static final int LOW_STOCK_THRESHOLD = 13;
    private static final DateTimeFormatter MONTH_FMT = DateTimeFormatter.ofPattern("yyyy-MM");

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final SiteSettingsRepository siteSettingsRepository;

    @Transactional(readOnly = true)
    public DashboardResponse dashboard() {
        BigDecimal revenue = orderRepository.totalRevenue();
        if (revenue == null) revenue = BigDecimal.ZERO;

        long pending = orderRepository.countByStatus(OrderStatus.PENDING_VERIFICATION);
        Instant since30d = LocalDate.now().minusDays(30).atStartOfDay(ZoneOffset.UTC).toInstant();
        long newOrders = orderRepository.countSince(since30d);
        long customers = userRepository.countByRole(Role.USER);
        long lowStock = productRepository.countByActiveTrueAndStockLessThan(LOW_STOCK_THRESHOLD);

        List<Order> recent = orderRepository.findRecent(PageRequest.of(0, 6));
        List<OrderResponse> recentDtos = recent.stream().map(OrderResponse::from).toList();

        List<DashboardResponse.MonthlySalesPoint> series = buildMonthlySeries();

        return new DashboardResponse(revenue, newOrders, pending, customers, lowStock, recentDtos, series);
    }

    private List<DashboardResponse.MonthlySalesPoint> buildMonthlySeries() {
        Instant since = YearMonth.now().minusMonths(5).atDay(1)
                .atStartOfDay(ZoneOffset.UTC).toInstant();
        Map<String, BigDecimal> byMonth = new HashMap<>();
        for (Object[] row : orderRepository.monthlyRevenueSince(since)) {
            byMonth.put((String) row[0], (BigDecimal) row[1]);
        }
        List<DashboardResponse.MonthlySalesPoint> out = new ArrayList<>();
        YearMonth cursor = YearMonth.now().minusMonths(5);
        for (int i = 0; i < 6; i++) {
            String key = cursor.format(MONTH_FMT);
            out.add(new DashboardResponse.MonthlySalesPoint(key,
                    byMonth.getOrDefault(key, BigDecimal.ZERO)));
            cursor = cursor.plusMonths(1);
        }
        return out;
    }

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> listCustomers(int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50),
                Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> result = userRepository.findByRole(Role.USER, pageable);
        return PageResponse.from(result, UserResponse::from);
    }

    @Transactional
    public UserResponse toggleCustomerActive(Long id) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found: " + id));
        u.setActive(!u.isActive());
        return UserResponse.from(userRepository.save(u));
    }

    @Transactional(readOnly = true)
    public Map<String, String> getSettings() {
        Map<String, String> out = new LinkedHashMap<>();
        for (SiteSettings s : siteSettingsRepository.findAll()) {
            out.put(s.getSettingKey(), s.getValue());
        }
        return out;
    }

    @Transactional
    public Map<String, String> updateSettings(SettingsUpdateRequest req) {
        req.settings().forEach((key, value) -> {
            SiteSettings s = siteSettingsRepository.findBySettingKey(key)
                    .orElseGet(() -> SiteSettings.builder().settingKey(key).build());
            s.setValue(value);
            siteSettingsRepository.save(s);
        });
        return getSettings();
    }
}
