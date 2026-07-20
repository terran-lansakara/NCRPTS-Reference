package lk.earth.earthuniversity.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.sql.Date;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Supplier {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "name")
    private String name;
    @Basic
    @Column(name = "registernumber")
    private String registernumber;
    @Basic
    @Column(name = "doregister")
    private Date doregister;
    @Basic
    @Column(name = "address")
    private String address;
    @Basic
    @Column(name = "email")
    private String email;
    @Basic
    @Column(name = "mobile")
    private String mobile;
    @Basic
    @Column(name = "description")
    private String description;
    @ManyToOne
    @JoinColumn(name = "supplierstatus_id", referencedColumnName = "id", nullable = false)
    private Supplierstatus supplierstatus;
    @ManyToOne
    @JoinColumn(name = "suppliertype_id", referencedColumnName = "id", nullable = false)
    private Suppliertype suppliertype;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee regemployee;
    @OneToMany(mappedBy = "supplier", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<Supply> supplies;
    @JsonIgnore
    @OneToMany(mappedBy = "supplier")
    private Collection<Puorder> puorders;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRegisternumber() {
        return registernumber;
    }

    public void setRegisternumber(String registernumber) {
        this.registernumber = registernumber;
    }

    public Date getDoregister() {
        return doregister;
    }

    public void setDoregister(Date doregister) {
        this.doregister = doregister;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
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
        Supplier supplier = (Supplier) o;
        return Objects.equals(id, supplier.id) && Objects.equals(name, supplier.name) && Objects.equals(registernumber, supplier.registernumber) && Objects.equals(doregister, supplier.doregister) && Objects.equals(address, supplier.address) && Objects.equals(email, supplier.email) && Objects.equals(mobile, supplier.mobile) && Objects.equals(description, supplier.description);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, registernumber, doregister, address, email, mobile, description);
    }

    public Supplierstatus getSupplierstatus() {
        return supplierstatus;
    }

    public void setSupplierstatus(Supplierstatus supplierstatus) {
        this.supplierstatus = supplierstatus;
    }

    public Suppliertype getSuppliertype() {
        return suppliertype;
    }

    public void setSuppliertype(Suppliertype suppliertype) {
        this.suppliertype = suppliertype;
    }

    public Employee getRegemployee() {
        return regemployee;
    }

    public void setRegemployee(Employee regemployee) {
        this.regemployee = regemployee;
    }

    public Collection<Supply> getSupplies() {
        return supplies;
    }

    public void setSupplies(Collection<Supply> supplies) {
        this.supplies = supplies;
    }

    public Collection<Puorder> getPuorders() {
        return puorders;
    }

    public void setPuorders(Collection<Puorder> puorders) {
        this.puorders = puorders;
    }
}
