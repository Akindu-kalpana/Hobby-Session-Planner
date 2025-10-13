// Mock Email Service
// In production, this would use a real email service like Nodemailer, SendGrid, or AWS SES

const sendSessionCreatedEmail = (email, sessionTitle, managementCode, privateCode) => {
  // simulate email sending delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // log the email content to console (simulating sending)
      console.log('\n📧 ===== EMAIL SENT =====');
      console.log(`To: ${email}`);
      console.log(`Subject: Your Session "${sessionTitle}" Has Been Created`);
      console.log('\n--- Email Content ---');
      console.log(`Hello,\n`);
      console.log(`Your hobby session "${sessionTitle}" has been successfully created!\n`);
      console.log(`IMPORTANT - Save these codes:\n`);
      console.log(`Management Code: ${managementCode}`);
      console.log(`(Use this code to edit or delete your session)\n`);
      
      if (privateCode) {
        console.log(`Private Session Code: ${privateCode}`);
        console.log(`(Share this code with participants to access your private session)\n`);
      }
      
      console.log(`Visit the app to manage your session.`);
      console.log('\nBest regards,');
      console.log('Hobby Session Planner Team');
      console.log('========================\n');
      
      resolve(true);
    }, 500);
  });
};

const sendAttendanceEmail = (email, sessionTitle, attendanceCode) => {
  // simulate email sending delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('\n📧 ===== EMAIL SENT =====');
      console.log(`To: ${email}`);
      console.log(`Subject: You Joined "${sessionTitle}"`);
      console.log('\n--- Email Content ---');
      console.log(`Hello,\n`);
      console.log(`You have successfully joined the session "${sessionTitle}"!\n`);
      console.log(`Your Attendance Code: ${attendanceCode}`);
      console.log(`(Save this code if you need to cancel your attendance later)\n`);
      console.log(`See you at the session!`);
      console.log('\nBest regards,');
      console.log('Hobby Session Planner Team');
      console.log('========================\n');
      
      resolve(true);
    }, 500);
  });
};

module.exports = {
  sendSessionCreatedEmail,
  sendAttendanceEmail
};