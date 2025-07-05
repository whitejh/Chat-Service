package jh.chatservice.entity;

import ch.qos.logback.classic.spi.LoggingEventVO;
import jakarta.persistence.*;
import jh.chatservice.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class Member {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="member_id")
    @Id
    Long id;

    String email;
    String nickName;
    String name;

    @Enumerated(EnumType.STRING)
    Gender gender;

    String phoneNumber;
    LocalDate birthDay;
    String role;


}
