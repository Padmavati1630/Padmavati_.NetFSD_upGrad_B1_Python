1. BASIC QUERY (SELECT + WHERE + ORDER BY)

SELECT * 
FROM Users
WHERE CreatedAt > '2024-01-01'
ORDER BY CreatedAt DESC;


2. LEFT JOIN

SELECT u.FullName, r.Score
FROM Users u
LEFT JOIN Results r ON u.UserId = r.UserId;
Shows all users (even if they have no results)

3. GROUP BY + COUNT

SELECT CourseId, COUNT(*) AS TotalLessons
FROM Lessons
GROUP BY CourseId;
Number of lessons per course

5. GROUP BY + AVG 

SELECT UserId, AVG(Score) AS AverageScore
FROM Results
GROUP BY UserId;
Average score per user

6. SUBQUERY 

SELECT *
FROM Results
WHERE Score > (SELECT AVG(Score) FROM Results);
Finds users scoring above average

7. SET OPERATOR (UNION)

SELECT Email FROM Users
UNION
SELECT DISTINCT Email FROM Users;

(If no second table, this is acceptable for demo)

8. INSERT

INSERT INTO Courses (Name, Description, CreatedBy, CreatedAt)
VALUES ('NodeJS Basics', 'Backend development', 1, CURRENT_TIMESTAMP);

