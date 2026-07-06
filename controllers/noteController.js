const path = require("path");
const fs = require("fs");
const Note = require("../models/Note");

exports.listNotes = (req, res, next) => {
    const { search, subject, sort, page, limit } = req.query;

    Note.findAll({ search, subject, sort, page, limit }, (err, result) => {
        if (err) return next(err);
        res.json(result);
    });
};

exports.getNote = (req, res, next) => {
    Note.findById(req.params.id, (err, note) => {
        if (err) return next(err);
        if (!note) return res.status(404).json({ error: "Note not found" });
        res.json(note);
    });
};

exports.createNote = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "You must be logged in to upload notes" });
    }
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const { title, subject, description } = req.body;
    if (!title || !title.trim()) {
        fs.unlink(req.file.path, () => {});
        return res.status(400).json({ error: "Title is required" });
    }
    if (!subject) {
        fs.unlink(req.file.path, () => {});
        return res.status(400).json({ error: "Subject is required" });
    }
    if (!description || !description.trim()) {
        fs.unlink(req.file.path, () => {});
        return res.status(400).json({ error: "Description is required" });
    }

    const noteData = {
        user_id: req.session.user.id,
        title: title.trim(),
        subject,
        description: description.trim(),
        file_name: req.file.originalname,
        file_path: req.file.filename,
        file_size: req.file.size,
        file_type: req.file.mimetype,
    };

    Note.create(noteData, (err, result) => {
        if (err) {
            fs.unlink(req.file.path, () => {});
            return next(err);
        }
        noteData.id = result.id;
        noteData.author_name = req.session.user.full_name;
        res.status(201).json(noteData);
    });
};

exports.updateNote = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "You must be logged in to edit notes" });
    }

    Note.findById(req.params.id, (err, existing) => {
        if (err) return next(err);
        if (!existing) return res.status(404).json({ error: "Note not found" });
        if (existing.user_id !== req.session.user.id) {
            return res.status(403).json({ error: "You can only edit your own notes" });
        }

        const data = {};
        if (req.body.title !== undefined) data.title = req.body.title.trim();
        if (req.body.subject !== undefined) data.subject = req.body.subject;
        if (req.body.description !== undefined) data.description = req.body.description.trim();

        if (req.file) {
            data.file_name = req.file.originalname;
            data.file_path = req.file.filename;
            data.file_size = req.file.size;
            data.file_type = req.file.mimetype;

            const oldPath = path.join(__dirname, "..", "uploads", "notes", existing.file_path);
            fs.unlink(oldPath, () => {});
        }

        Note.update(req.params.id, req.session.user.id, data, (err2, result2) => {
            if (err2) {
                if (req.file) fs.unlink(req.file.path, () => {});
                return next(err2);
            }
            if (result2.changes === 0) {
                return res.status(404).json({ error: "Note not found or no changes made" });
            }
            Note.findById(req.params.id, (err3, updated) => {
                if (err3) return next(err3);
                res.json(updated);
            });
        });
    });
};

exports.deleteNote = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "You must be logged in to delete notes" });
    }

    Note.findById(req.params.id, (err, existing) => {
        if (err) return next(err);
        if (!existing) return res.status(404).json({ error: "Note not found" });
        if (existing.user_id !== req.session.user.id) {
            return res.status(403).json({ error: "You can only delete your own notes" });
        }

        Note.delete(req.params.id, req.session.user.id, (err2, result) => {
            if (err2) return next(err2);
            if (result.changes === 0) return res.status(404).json({ error: "Note not found" });

            const filePath = path.join(__dirname, "..", "uploads", "notes", existing.file_path);
            fs.unlink(filePath, () => {});

            res.json({ message: "Note deleted successfully" });
        });
    });
};

exports.downloadNote = (req, res, next) => {
    Note.findById(req.params.id, (err, note) => {
        if (err) return next(err);
        if (!note) return res.status(404).json({ error: "Note not found" });

        const filePath = path.join(__dirname, "..", "uploads", "notes", note.file_path);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "File not found on server" });
        }

        Note.incrementDownloads(req.params.id, () => {});

        res.download(filePath, note.file_name);
    });
};

exports.getMyNotes = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "You must be logged in" });
    }

    Note.findByUserId(req.session.user.id, (err, notes) => {
        if (err) return next(err);
        res.json(notes);
    });
};
