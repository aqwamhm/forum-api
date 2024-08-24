/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("user_comment_likes", {
        id: {
            type: "VARCHAR(50)",
            primaryKey: true,
            notNull: true,
        },
        user: {
            type: "VARCHAR(50)",
            notNull: true,
        },
        comment: {
            type: "VARCHAR(50)",
            notNull: true,
        },
    });

    pgm.addConstraint("user_comment_likes", "fk_user", {
        foreignKeys: {
            columns: "user",
            references: "users(id)",
            onDelete: "cascade",
        },
    });

    pgm.addConstraint("user_comment_likes", "fk_comment", {
        foreignKeys: {
            columns: "comment",
            references: "comments(id)",
            onDelete: "cascade",
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("user_comment_likes");
};
