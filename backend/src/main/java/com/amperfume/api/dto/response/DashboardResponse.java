package com.amperfume.api.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        BigDecimal totalRevenue,
        long newOrdersCount,
        long pendingOrdersCount,
        long totalCustomers,
        long lowStockProducts,
        List<OrderResponse> recentOrders,
        List<MonthlySalesPoint> monthlySalesData
) {
    public record MonthlySalesPoint(String month, BigDecimal revenue) {}
}
