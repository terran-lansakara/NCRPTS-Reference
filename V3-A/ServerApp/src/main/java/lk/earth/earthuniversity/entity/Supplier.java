package lk.earth.earthuniversity.entity;

import javax.persistence.*;
import java.sql.Date;
import java.util.Collection;

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
    @JoinColumn(name = "regemployee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;

    @OneToMany(mappedBy = "supplier", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<Supply> supplies;

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

        if (id != null ? !id.equals(supplier.id) : supplier.id != null) return false;
        if (name != null ? !name.equals(supplier.name) : supplier.name != null) return false;
        if (registernumber != null ? !registernumber.equals(supplier.registernumber) : supplier.registernumber != null)
            return false;
        if (doregister != null ? !doregister.equals(supplier.doregister) : supplier.doregister != null) return false;
        if (address != null ? !address.equals(supplier.address) : supplier.address != null) return false;
        if (email != null ? !email.equals(supplier.email) : supplier.email != null) return false;
        if (mobile != null ? !mobile.equals(supplier.mobile) : supplier.mobile != null) return false;
        if (description != null ? !description.equals(supplier.description) : supplier.description != null)
            return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (registernumber != null ? registernumber.hashCode() : 0);
        result = 31 * result + (doregister != null ? doregister.hashCode() : 0);
        result = 31 * result + (address != null ? address.hashCode() : 0);
        result = 31 * result + (email != null ? email.hashCode() : 0);
        result = 31 * result + (mobile != null ? mobile.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        return result;
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

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Collection<Supply> getSupplies() {
        return supplies;
    }

    public void setSupplies(Collection<Supply> supplies) {
        this.supplies = supplies;
    }
}
