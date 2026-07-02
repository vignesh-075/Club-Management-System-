@echo off
echo Setting up Club Management System with MongoDB...
echo.

echo Installing dependencies...
call npm install

echo.
echo Setting up MongoDB users with credentials...
call npm run seed-users

echo.
echo Setup complete! You can now start the application with:
echo npm run dev
echo.
pause
