package net.projectJournal.journalApp.Controllers;

import net.projectJournal.journalApp.Entity.JournalEntry;
import net.projectJournal.journalApp.Entity.User;
import net.projectJournal.journalApp.Services.SentimentAnalysisService;
import net.projectJournal.journalApp.Services.UserService;
import net.projectJournal.journalApp.Services.JournalEntryService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController // It is used to tell that this class is made for Http requests
@RequestMapping("/journal") // Adds Mapping to the whole class
public class JournalEntryController_V2 {

    @Autowired
    private JournalEntryService journalEntryService;

    @Autowired
    private UserService userService;

    @Autowired
    private SentimentAnalysisService sentimentAnalysisService;

    // @GetMapping
    // It should Always be Public So that it can be accessed or invoked
    // public List<JournalEntry> getAll(){
    // return journalEntryService.getAll();
    // }

    @GetMapping
    public ResponseEntity<?> getAllJournalEntriesOfUsers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.findByUsername(username);
        List<JournalEntry> all = user.getJournalEntries();
        if (all != null && !all.isEmpty()) {
            return new ResponseEntity<>(all, HttpStatus.OK);
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK); // Return empty list instead of 404
    }

    // @PostMapping
    // public JournalEntry createEntry(@RequestBody JournalEntry myEntry){
    // myEntry.setDate(LocalDateTime.now());
    // journalEntryService.saveUser(myEntry);
    // return myEntry;
    // }

    @PostMapping
    public ResponseEntity<JournalEntry> createEntry(@RequestBody JournalEntry myEntry) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();

            // If sentiment is not provided by the user, calculate it using AI
            if (myEntry.getSentiment() == null) {
                String text = myEntry.getTitle() + " " + myEntry.getContent();
                myEntry.setSentiment(sentimentAnalysisService.getSentiment(text));
            }

            journalEntryService.saveEntry(myEntry, username);
            return new ResponseEntity<>(myEntry, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // @GetMapping("id/{myId}")
    // public JournalEntry getJournalEntryById(@PathVariable ObjectId myId){
    // return journalEntryService.findById(myId).orElse(null);
    // //Due To Optional
    // }

    // @GetMapping("id/{myId}")
    // public ResponseEntity<JournalEntry> getJournalEntryById(@PathVariable
    // ObjectId myId){
    // Authentication authentication =
    // SecurityContextHolder.getContext().getAuthentication();
    // String username = authentication.getName();
    // User user = userService.findByUsername(username);
    // List<JournalEntry> collect = user.getJournalEntries().stream().filter(x ->
    // x.getId().equals(myId)).collect(Collectors.toList());
    // if (!collect.isEmpty()){
    // Optional<JournalEntry> journalEntry = journalEntryService.findById(myId); //
    // Find Entry in Service & save to journalEntry
    // if (journalEntry.isPresent()){ // If Entry Is Present Then
    // return new ResponseEntity<>(journalEntry.get(), HttpStatus.OK);
    // }
    // }
    // return new ResponseEntity<>(HttpStatus.NOT_FOUND); //If not then again -->
    // 404 Not Found
    // }

    @GetMapping("id/{myId}")
    public ResponseEntity<JournalEntry> getJournalEntryById(@PathVariable ObjectId myId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.findByUsername(username);
        // 🔍 Pehle user ki list me try karo
        Optional<JournalEntry> fromUserList = user.getJournalEntries().stream()
                .filter(x -> x.getId().equals(myId))
                .findFirst();
        if (fromUserList.isPresent()) {
            return new ResponseEntity<>(fromUserList.get(), HttpStatus.OK);
        }
        // 🔍 Agar user list me nahi mila, to DB me try karo
        Optional<JournalEntry> fromDb = journalEntryService.findById(myId);
        if (fromDb.isPresent()) {
            return new ResponseEntity<>(fromDb.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }

    @DeleteMapping("id/{myId}")
    public ResponseEntity<?> deleteJournalEntryById(@PathVariable ObjectId myId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        boolean removed = journalEntryService.deleteById(myId, username);// Told the Service to Delete It
        if (removed) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // Success then 204 No Content
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Success then 204 No Content
        }
    }

    @PutMapping("id/{myId}")
    public ResponseEntity<?> updateJournalById(@PathVariable ObjectId myId, @RequestBody JournalEntry newEntry) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userService.findByUsername(username);

        List<JournalEntry> collect = user.getJournalEntries().stream().filter(x -> x.getId().equals(myId))
                .collect(Collectors.toList());
        if (!collect.isEmpty()) {
            Optional<JournalEntry> journalEntry = journalEntryService.findById(myId);
            if (journalEntry.isPresent()) {
                JournalEntry old = journalEntry.get();
                old.setTitle(newEntry.getTitle() != null && !newEntry.getTitle().equals("") ? newEntry.getTitle()
                        : old.getTitle());
                old.setContent(newEntry.getContent() != null && !newEntry.equals("") ? newEntry.getContent()
                        : old.getContent());

                // If user provides a specific sentiment, use it.
                if (newEntry.getSentiment() != null) {
                    old.setSentiment(newEntry.getSentiment());
                } else {
                    // Otherwise, re-analyze based on new content
                    String text = old.getTitle() + " " + old.getContent();
                    old.setSentiment(sentimentAnalysisService.getSentiment(text));
                }

                journalEntryService.saveEntry(old);
                return new ResponseEntity<>(old, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
