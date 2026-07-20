package lk.earth.earthuniversity.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
public class Puoitem {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "qty")
    private Integer qty;
    @Basic
    @Column(name = "linecost")
    private BigDecimal linecost;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "puorder_id", referencedColumnName = "id", nullable = false)
    private Puorder puorder;
    @ManyToOne
    @JoinColumn(name = "item_id", referencedColumnName = "id", nullable = false)
    private Item item;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getQty() {
        return qty;
    }

    public void setQty(Integer qty) {
        this.qty = qty;
    }

    public BigDecimal getLinecost() {
        return linecost;
    }

    public void setLinecost(BigDecimal linecost) {
        this.linecost = linecost;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Puoitem puoitem = (Puoitem) o;
        return Objects.equals(id, puoitem.id) && Objects.equals(qty, puoitem.qty) && Objects.equals(linecost, puoitem.linecost);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, qty, linecost);
    }

    public Puorder getPuorder() {
        return puorder;
    }

    public void setPuorder(Puorder puorder) {
        this.puorder = puorder;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }
}
