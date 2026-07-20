package lk.earth.earthuniversity.entity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Puorder {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "puonumber")
    private String puonumber;
    @Basic
    @Column(name = "date")
    private Date date;
    @Basic
    @Column(name = "expectedcost")
    private BigDecimal expectedcost;
    @Basic
    @Column(name = "description")
    private String description;
    @OneToMany(mappedBy = "puorder", cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<Puoitem> puoitems;
    @ManyToOne
    @JoinColumn(name = "puostatus_id", referencedColumnName = "id", nullable = false)
    private Puostatus puostatus;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;
    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id", nullable = false)
    private Supplier supplier;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPuonumber() {
        return puonumber;
    }

    public void setPuonumber(String puonumber) {
        this.puonumber = puonumber;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public BigDecimal getExpectedcost() {
        return expectedcost;
    }

    public void setExpectedcost(BigDecimal expectedcost) {
        this.expectedcost = expectedcost;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Puorder puorder = (Puorder) o;
        return Objects.equals(id, puorder.id) && Objects.equals(puonumber, puorder.puonumber) && Objects.equals(date, puorder.date) && Objects.equals(expectedcost, puorder.expectedcost) && Objects.equals(description, puorder.description);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, puonumber, date, expectedcost, description);
    }

    public Collection<Puoitem> getPuoitems() {
        return puoitems;
    }

    public void setPuoitems(Collection<Puoitem> puoitems) {
        this.puoitems = puoitems;
    }

    public Puostatus getPuostatus() {
        return puostatus;
    }

    public void setPuostatus(Puostatus puostatus) {
        this.puostatus = puostatus;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }
}
