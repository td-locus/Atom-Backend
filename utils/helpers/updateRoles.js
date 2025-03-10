import User from "../../models/User.js";

export const updateUsersRoles = async () => {
  try {
    const currentYear = new Date().getFullYear().toString();
    let users = await User.find();
    users = users.map((u) => u.toObject());
    let count = 0;

    for (const user of users) {
      const roles = user.roles;

      if (!roles[currentYear]) {
        count += 1;
        const previousYear = (parseInt(currentYear) - 1).toString();
        const previousYearRole = roles[previousYear];

        roles[currentYear] = previousYearRole;

        await User.updateOne({ _id: user._id }, { $set: { roles: roles } });
      }
    }

    if (count > 0) {
      console.log(count + " users roles updated successfully.");
    }
    return;
  } catch (error) {
    console.error("Error updating users roles:", error);
  }
};
