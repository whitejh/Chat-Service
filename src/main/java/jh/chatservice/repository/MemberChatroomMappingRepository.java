package jh.chatservice.repository;

import jh.chatservice.entity.MemberChatroomMapping;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberChatroomMappingRepository extends JpaRepository<MemberChatroomMapping, Long> {
}
