package lk.earth.earthuniversity.security;

import lk.earth.earthuniversity.dao.UserDao;
import lk.earth.earthuniversity.entity.Privilege;
import lk.earth.earthuniversity.entity.User;
import lk.earth.earthuniversity.entity.Userrole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class UserService implements UserDetailsService {

    final UserDao userdao;

    @Autowired
    public UserService(UserDao userdao) {
        this.userdao = userdao;
    }

    public User getByUsername(String username){

        User user = new User();

        if ("AdminEUC".equals(username)){

            user.setUsername(username);

        }else {
            user = userdao.findByUsername(username);
            if (user == null) {
                throw new UsernameNotFoundException("User not found with username: " + username);
            }
        }

        return user;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        if (username.equals("AdminEUC")) {
            Set<SimpleGrantedAuthority> authorities = new HashSet<>();
            authorities.add(new SimpleGrantedAuthority("user-select"));
            authorities.add(new SimpleGrantedAuthority("user-delete"));
            authorities.add(new SimpleGrantedAuthority("user-update"));
            authorities.add(new SimpleGrantedAuthority("user-insert"));

            authorities.add(new SimpleGrantedAuthority("privilege-select"));
            authorities.add(new SimpleGrantedAuthority("privilege-delete"));
            authorities.add(new SimpleGrantedAuthority("privilege-update"));
            authorities.add(new SimpleGrantedAuthority("privilege-insert"));

            authorities.add(new SimpleGrantedAuthority("employee-select"));
            authorities.add(new SimpleGrantedAuthority("employee-delete"));
            authorities.add(new SimpleGrantedAuthority("employee-update"));
            authorities.add(new SimpleGrantedAuthority("employee-insert"));

            authorities.add(new SimpleGrantedAuthority("operations-select"));
            authorities.add(new SimpleGrantedAuthority("operations-delete"));
            authorities.add(new SimpleGrantedAuthority("operations-update"));
            authorities.add(new SimpleGrantedAuthority("operations-insert"));

            authorities.add(new SimpleGrantedAuthority("program-select"));
            authorities.add(new SimpleGrantedAuthority("program-delete"));
            authorities.add(new SimpleGrantedAuthority("program-update"));
            authorities.add(new SimpleGrantedAuthority("program-insert"));

            authorities.add(new SimpleGrantedAuthority("course-select"));
            authorities.add(new SimpleGrantedAuthority("course-delete"));
            authorities.add(new SimpleGrantedAuthority("course-update"));
            authorities.add(new SimpleGrantedAuthority("course-insert"));

            authorities.add(new SimpleGrantedAuthority("Batch-select"));
            authorities.add(new SimpleGrantedAuthority("Batch-delete"));
            authorities.add(new SimpleGrantedAuthority("Batch-update"));
            authorities.add(new SimpleGrantedAuthority("Batch-insert"));

            authorities.add(new SimpleGrantedAuthority("Payment Schedule-select"));
            authorities.add(new SimpleGrantedAuthority("Payment Schedule-delete"));
            authorities.add(new SimpleGrantedAuthority("Payment Schedule-update"));
            authorities.add(new SimpleGrantedAuthority("Payment Schedule-insert"));

            authorities.add(new SimpleGrantedAuthority("Course Materiale-select"));
            authorities.add(new SimpleGrantedAuthority("Course Material-delete"));
            authorities.add(new SimpleGrantedAuthority("Course Material-update"));
            authorities.add(new SimpleGrantedAuthority("Course Material-insert"));

            authorities.add(new SimpleGrantedAuthority("Mat. Distribution-select"));
            authorities.add(new SimpleGrantedAuthority("Mat. Distribution-delete"));
            authorities.add(new SimpleGrantedAuthority("Mat. Distribution-update"));
            authorities.add(new SimpleGrantedAuthority("Mat. Distribution-insert"));

            authorities.add(new SimpleGrantedAuthority("Payments-select"));
            authorities.add(new SimpleGrantedAuthority("Payments-delete"));
            authorities.add(new SimpleGrantedAuthority("Payments-update"));
            authorities.add(new SimpleGrantedAuthority("Payments-insert"));

            authorities.add(new SimpleGrantedAuthority("student-select"));
            authorities.add(new SimpleGrantedAuthority("student-delete"));
            authorities.add(new SimpleGrantedAuthority("student-update"));
            authorities.add(new SimpleGrantedAuthority("student-insert"));

            authorities.add(new SimpleGrantedAuthority("Batch Registration-select"));
            authorities.add(new SimpleGrantedAuthority("Batch Registration-delete"));
            authorities.add(new SimpleGrantedAuthority("Batch Registration-update"));
            authorities.add(new SimpleGrantedAuthority("Batch Registration-insert"));

            authorities.add(new SimpleGrantedAuthority("Class Schedule-select"));
            authorities.add(new SimpleGrantedAuthority("Class Schedule-delete"));
            authorities.add(new SimpleGrantedAuthority("Class Schedule-update"));
            authorities.add(new SimpleGrantedAuthority("Class Schedule-insert"));

            authorities.add(new SimpleGrantedAuthority("Attendance-select"));
            authorities.add(new SimpleGrantedAuthority("Attendance-delete"));
            authorities.add(new SimpleGrantedAuthority("Attendance-update"));
            authorities.add(new SimpleGrantedAuthority("Attendance-insert"));

            authorities.add(new SimpleGrantedAuthority("Progress Review-select"));
            authorities.add(new SimpleGrantedAuthority("Progress Review-delete"));
            authorities.add(new SimpleGrantedAuthority("Progress Review-update"));
            authorities.add(new SimpleGrantedAuthority("Progress Review-insert"));

            return org.springframework.security.core.userdetails.User
                    .withUsername("AdminEUC")
                    .password(new BCryptPasswordEncoder().encode("Admin1234"))
                    .authorities(authorities)
                    .accountExpired(false)
                    .accountLocked(false)
                    .credentialsExpired(false)
                    .disabled(false)
                    .build();
        }
        else {

            User user = userdao.findByUsername(username);
            if (user == null) {
                throw new UsernameNotFoundException("User not found with username: " + username);
            }

            Set<SimpleGrantedAuthority> authorities = new HashSet<>();

            List<Userrole> userroles = (List<Userrole>) user.getUserroles();

            for(Userrole u : userroles){
                List<Privilege> privileges = (List<Privilege>) u.getRole().getPrivileges();
                for (Privilege p:privileges){
                    authorities.add(new SimpleGrantedAuthority(p.getAuthority()));
                }
            }

            return org.springframework.security.core.userdetails.User
                    .withUsername(user.getUsername())
                    .password(user.getPassword())
                    .authorities(authorities)
                    .accountExpired(false)
                    .accountLocked(false)
                    .credentialsExpired(false)
                    .disabled(false)
                    .build();
        }
    }
}
