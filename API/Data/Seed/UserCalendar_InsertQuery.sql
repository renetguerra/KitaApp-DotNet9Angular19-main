-- 1. Execute:
INSERT INTO Calendars (Title, Description, StartDate, EndDate, IsVacation, IsHolidays, IsSickLeave, IsOther)
VALUES 
('New Year''s Day', 'New Year''s celebration', '2025-01-01', '2025-01-01', 0, 1, 0, 0),
('Good Friday', 'Commemoration of Good Friday', '2025-04-18', '2025-04-18', 0, 1, 0, 0),
('Easter Monday', 'Celebration of Easter Monday', '2025-04-21', '2025-04-21', 0, 1, 0, 0),
('Labor Day', 'International Workers'' Day', '2025-05-01', '2025-05-01', 0, 1, 0, 0),
('Ascension Day', 'Celebration of the Ascension of Jesus', '2025-05-29', '2025-05-29', 0, 1, 0, 0),
('Whit Monday', 'Celebration of Whit Monday', '2025-06-09', '2025-06-09', 0, 1, 0, 0),
('German Unity Day', 'Celebration of German reunification', '2025-10-03', '2025-10-03', 0, 1, 0, 0),
('Reformation Day', 'Commemoration of the Protestant Reformation', '2025-10-31', '2025-10-31', 0, 1, 0, 0),
('Christmas Day', 'Christmas celebration', '2025-12-25', '2025-12-25', 0, 1, 0, 0),
( 'Boxing Day', 'Celebration of the second day of Christmas', '2025-12-26', '2025-12-26', 0, 1, 0, 0);

-- 2. Execute:
INSERT INTO UserCalendars (CalendarId, UserId)
SELECT c.Id, s.Id
FROM [KitaDB].[dbo].Calendars c
CROSS JOIN [KitaDB].[dbo].[AspNetUsers] s;