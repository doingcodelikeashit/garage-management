const TempGarageRegistration = require("../Model/tempGarageRegistration.model");

const cleanupExpiredRegistrations = async () => {
  try {
    const expiredRegistrations = await TempGarageRegistration.find({
      otpExpiresAt: { $lt: new Date() },
    });

    if (expiredRegistrations.length > 0) {
      await TempGarageRegistration.deleteMany({
        otpExpiresAt: { $lt: new Date() },
      });
      console.log(
        `Cleaned up ${expiredRegistrations.length} expired registrations`
      );
    }
  } catch (error) {
    console.error("Error cleaning up expired registrations:", error);
  }
};

module.exports = cleanupExpiredRegistrations;
