/* eslint-disable camelcase */
exports.up = (pgm) => {
    pgm.createTable("threads", {
        id: {
            type: "VARCHAR(50)",
            primaryKey: true,
        },
        title: {
            type: "TEXT",
            notNull: true,
        },
        body: {
            type: "TEXT",
            notNull: true,
        },
        date: {
            type: "TEXT",
            notNull: true,
        },
        owner: {
            type: "VARCHAR(50)",
            notNull: true,
        },
    });

    pgm.addConstraint("threads", "fk_threads_owner_users", {
        foreignKeys: {
            columns: "owner",
            references: "users(id)",
            onDelete: "CASCADE",
        },
    });
};

exports.down = (pgm) => {
    pgm.dropConstraint("threads", "fk_threads_owner_users");
    pgm.dropTable("threads");
};
