package net.projectJournal.journalApp.service;

import net.projectJournal.journalApp.repository.UserRepository;
import net.projectJournal.journalApp.Entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testFindByUsername() {
        User user = userRepository.findByUsername("ram");
        System.out.println(user);
        System.out.println("Entries: " + user.getJournalEntries());
        System.out.println("Size: " + user.getJournalEntries().size());
        assertTrue(!user.getJournalEntries().isEmpty());
    }
}
