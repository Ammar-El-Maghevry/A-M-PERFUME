package com.amperfume.api.repository;

import com.amperfume.api.entity.Order;
import com.amperfume.api.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Optional<Order> findByIdAndUserId(Long id, Long userId);
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    long countByStatus(OrderStatus status);

    @Query("select count(o) from Order o where o.createdAt >= :since")
    long countSince(@Param("since") Instant since);

    @Query("""
            select coalesce(sum(o.total), 0) from Order o
            where o.status not in (com.amperfume.api.enums.OrderStatus.REJECTED,
                                   com.amperfume.api.enums.OrderStatus.CANCELLED)
            """)
    BigDecimal totalRevenue();

    @Query("""
            select function('to_char', o.createdAt, 'YYYY-MM') as bucket,
                   coalesce(sum(o.total), 0) as revenue
            from Order o
            where o.createdAt >= :since
              and o.status not in (com.amperfume.api.enums.OrderStatus.REJECTED,
                                   com.amperfume.api.enums.OrderStatus.CANCELLED)
            group by function('to_char', o.createdAt, 'YYYY-MM')
            order by bucket asc
            """)
    List<Object[]> monthlyRevenueSince(@Param("since") Instant since);

    @Query("select o from Order o order by o.createdAt desc")
    List<Order> findRecent(Pageable pageable);

    @Query("""
            select count(o) from Order o
            where function('to_char', o.createdAt, 'YYYY') = :year
            """)
    long countByYear(@Param("year") String year);
}
