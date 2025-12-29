package net.projectJournal.journalApp.repository;

import net.projectJournal.journalApp.Entity.JournalEntry;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface JournalEntryRepo extends MongoRepository<JournalEntry, ObjectId> {
    // SpringData MongoDB ke dwara ek inteface provide kiya gaya hai jise bolte hai
    // MongoRepository

}
