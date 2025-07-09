package jh.chatservice.entity;

import jakarta.persistence.*;

@Entity
public class MemberChatroomMapping {

    @Id
    @Column(name = "member_chatroom_mapping_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    Member member;

    @ManyToOne
    @JoinColumn(name = "chatroom_id")
    Chatroom chatroom;
}
