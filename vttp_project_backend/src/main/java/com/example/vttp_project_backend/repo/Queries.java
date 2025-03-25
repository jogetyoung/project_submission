package com.example.vttp_project_backend.repo;

public class Queries {

        public static final String INSERT_NEW_USER = """
                        insert into user(id, first_name, last_name, email, password)
                        values (?,?,?,?,?)
                        	""";

        public static final String GET_USER_BY_EMAIL = """
                               SELECT * FROM user WHERE email = ?
                        """;

        public static final String INSERT_NEW_BUSINESS = """
                        insert into company(id, company_name, company_email, password)
                        values (?,?,?,?)
                        	""";

        public static final String GET_BUSINESS_BY_EMAIL = """
                               SELECT * FROM company WHERE company_email = ?
                        """;

        public static final String INSERT_INTO_USER_APPLIED = """
                        insert into user_applied(id, user_id, job_id, resume_url, applied_date)
                        values (?,?,?,?,?)
                          """;

        public static final String GET_APPLIED_JOBS = """
                        select * from user_applied where user_id = ?
                            """;

        public static final String HAVE_APPLIED = """
                        select * from user_applied where id = ?
                                  """;

        public static final String INSERT_INTO_USER_SAVED = """
                        insert into user_saved(user_id, job_id)
                        values (?,?)
                          """;

        public static final String HAVE_SAVED = """
                        select * from user_saved where user_id = ? AND job_id = ?
                                  """;

        public static final String GET_SAVED_JOBS = """
                        select * from user_saved where user_id = ?
                            """;

        public static final String DELETE_SAVED_JOB = """
                        DELETE FROM user_saved WHERE user_id = ? AND job_id = ?
                                    """;

        public static final String INCREASE_APP_COUNT = """
                        UPDATE job_post
                        SET applied = applied + 1, last_updated = ?
                        WHERE id = ?;
                                          """;

        public static final String UPDATE_APPLICANT_LAST_SEEN = """
                        UPDATE job_post
                        SET last_seen = ?
                        WHERE id = ?;
                            """;

        public static final String INCREASE_BOOKMARK_COUNT = """
                        UPDATE job_post
                        SET saved = saved + 1
                        WHERE id = ?
                                        """;

        public static final String DECREASE_BOOKMARK_COUNT = """
                        UPDATE job_post
                        SET saved = saved - 1
                        WHERE id = ?
                                        """;

        public static final String GET_COUNT_COMPANY = """
                        SELECT COUNT(*) FROM company WHERE company_name = ?
                                                         """;

        public static final String INSERT_JOB_POST = """
                              INSERT INTO job_post (id, title, company_name, publication_date)
                        VALUES (?, ?, ?, ?);
                                              """;
        public static final String GET_POSTS_BY_COMP_NAME = """
                                select * from job_post where company_name = ?
                                ORDER BY publication_date DESC;
                        """;
        public static final String UPDATE_TIME = """
                        UPDATE company
                        SET last_checked = ?
                        WHERE company_name = ?
                                        """;

        public static final String GET_COMPANY_LASTCHECKED = """
                        SELECT last_checked FROM company WHERE company_name = ?
                                                         """;

        public static final String GET_APPLICANTS_BYJOBID = """
                        select user.id, appliedjob.resume_url, user.first_name, user.last_name,user.email, appliedjob.applied_date, user.profile_pic
                        from user_applied as appliedjob
                        join user as user
                        on appliedjob.user_id = user.id
                        where appliedjob.job_id = ?
                        """;

        public static final String GET_USER_BY_ID = """
                               SELECT * FROM user WHERE id = ?
                        """;

        public static final String GET_POST_BY_ID = """
                                select * from job_post where id = ?
                        """;
        public static final String UPDATE_PIC_URL = """
                        UPDATE user
                        SET profile_pic = ?
                        WHERE id = ?
                                        """;
        public static final String UPDATE_RES_URL = """
                        UPDATE user
                        SET resume = ?
                        WHERE id = ?
                                        """;
        public static final String UPDATE_APPLICANT_FIELDS = """
                        UPDATE user
                        SET first_name = ?, last_name = ?, location = ?, headline = ?
                        WHERE id = ?
                                        """;

        public static final String GET_ALL_USERS = """
                        SELECT * from user
                                        """;

        public static final String GET_APP_BY_TERM = """
                        SELECT * FROM user
                               WHERE headline LIKE ?;
                                                                       """;

        public static final String UPDATE_TITLE = """
                        UPDATE job_post
                        SET title = ?
                        WHERE id = ?
                                        """;
        public static final String INSERT_EMP_HIST = """
                              INSERT INTO employment_history (id, user_id,  title, company, job_description, location, job_type,location_type,
                              start_month, start_year, end_month, end_year, current_role)
                        VALUES (?, ?, ?, ?,?,?,?,?,?,?,?,?, ?);
                                              """;

        public static final String GET_EMP_HIST_BY_USERID = """
                        SELECT * FROM employment_history where user_id = ?
                        ORDER BY (current_role = true) DESC, end_year DESC;
                                                """;

        public static final String GET_EMP_HIST_BY_ID = """
                        SELECT * FROM employment_history where id = ?;
                                                """;

        public static final String UPDATE_EMP_HIST = """
                        UPDATE employment_history
                        SET title = ?, company = ?, job_description = ?, location = ?, job_type = ?,location_type= ?,
                        start_month = ?, start_year = ?, end_month = ?, end_year = ?, current_role = ?
                        WHERE id = ?
                                        """;

        public static final String UPDATE_BIZ_PREMIUM = """
                        UPDATE company SET premium = true
                            where id = ?
                                """;
        public static final String UPDATE_PROMOTED = """
                        UPDATE job_post
                        SET promoted = true
                        WHERE id = ?
                                        """;
        public static final String REMOVE_HIST = """
                        DELETE FROM
                        employment_history WHERE id= ?
                                            """;

        public static final String GET_ALL_SKILLS = """
                        SELECT * FROM skill_set
                                                                    """;
        public static final String UPDATE_USERSKILL = """
                        INSERT into user_skills (user_id, skill_id) VALUES (?,?)
                                                                            """;
        public static final String GET_SKILLS_BYUSERID = """
                        select *
                        from skill_set
                        join user_skills as user
                        on user.skill_id = skill_set.id
                        where user.user_id = ?
                        """;

        public static final String REMOVE_JOB = """
                        DELETE FROM
                        job_post WHERE id= ?
                                            """;
        public static final String REMOVE_JOB_FROM_APPLIED = """
                        DELETE FROM
                        user_applied WHERE job_id= ?
                                            """;
        public static final String REMOVE_JOB_FROM_SAVED = """
                        DELETE FROM
                        user_saved WHERE job_id= ?
                                            """;
}
