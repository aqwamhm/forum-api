/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("comments", {
        id: {
            type: "VARCHAR(50)",
            primaryKey: true,
            notNull: true,
        },
        content: {
            type: "TEXT",
            notNull: true,
        },
        owner: {
            type: "VARCHAR(50)",
            notNull: true,
        },
        thread: {
            type: "VARCHAR(50)",
            notNull: true,
        },
        date: {
            type: "TEXT",
            notNull: true,
        },
        is_deleted: {
            type: "BOOlEAN",
            default: false,
            notNull: true,
        },
    });

    pgm.addConstraint("comments", "fk_comments_owner_users", {
        foreignKeys: {
            columns: "owner",
            references: "users(id)",
            onDelete: "CASCADE",
        },
    });

    pgm.addConstraint("comments", "fk_comments_thread_threads", {
        foreignKeys: {
            columns: "thread",
            references: "threads(id)",
            onDelete: "CASCADE",
        },
    });
};

exports.down = (pgm) => {
    pgm.dropConstraint("comments", "fk_comments_thread_threads");
    pgm.dropConstraint("comments", "fk_comments_owner_users");

    pgm.dropTable("comments");
};
