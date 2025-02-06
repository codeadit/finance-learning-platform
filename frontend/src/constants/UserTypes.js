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
    Founder: UserTypes.FOUNDER,
    Teacher: UserTypes.TEACHER,
    Student: UserTypes.STUDENT,
    Developer: UserTypes.DEVELOPER,
  };

  if (backendUserType === null || backendUserType === undefined) {
    return UserTypes.STUDENT;
  }
  const frontendUserType = mapping[backendUserType] || UserTypes.STUDENT;
  return frontendUserType;
};

export const convertFrontEndToBackendUserType = (frontendUserType) => {
  const mapping = {
    [UserTypes.FOUNDER]: "founder",
    [UserTypes.TEACHER]: "teacher",
    [UserTypes.STUDENT]: "student",
    [UserTypes.DEVELOPER]: "developer",
  };

  if (frontendUserType === null || frontendUserType === undefined) {
    return "student";
  }
  const backendUserType = mapping[frontendUserType] || "student";
  return backendUserType;
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
