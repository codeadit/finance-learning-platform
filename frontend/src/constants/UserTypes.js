export const UserTypes = {
  FOUNDER: "Founder",
  TEACHER: "Teacher",
  STUDENT: "Student",
  DEVELOPER: "Developer",
};

// Function to convert backend constants to frontend constants
export const convertBackendToFrontendUserType = (backendUserType) => {
  const mapping = {
    founder: UserTypes.FOUNDER,
    teacher: UserTypes.TEACHER,
    student: UserTypes.STUDENT,
    developer: UserTypes.DEVELOPER,
  };

  // temp till I get more implementation in
  return UserTypes.DEVELOPER;

  if (backendUserType === null || backendUserType === undefined) {
    return UserTypes.STUDENT;
  }

  return mapping[backendUserType.toLowerCase()] || null;
};

export const haveUserManagementAccess = (userType) => {
  if (userType === null || userType === undefined) {
    return false;
  }

  if (userType === UserTypes.FOUNDER) {
    return true;
  }
  if (userType === UserTypes.DEVELOPER) {
    return true;
  }

  return false;
};
