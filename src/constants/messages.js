const messages = {
    success: {
      USER_CREATED: 'User has been successfully created.',
      USER_UPDATED: 'User has been successfully updated.',
      USER_DELETED: 'User has been successfully deleted.',
      FETCH_SUCCESS: 'Data fetched successfully.',
      DEPT_CREATED: 'Department has been successfully created.',

    },
    error: {
      USER_NOT_FOUND: 'User not found.',
      USER_EXISTS: 'User already exists.',
      USER_CREATION_FAILED: 'Failed to create user.',
      USER_UPDATE_FAILED: 'Failed to update user.',
      USER_DELETION_FAILED: 'Failed to delete user.',
      FETCH_ERROR: 'Failed to fetch data.',
      INVALID_EMAIL_PWD: 'Invalid email or password',
      INTERNAL_SERVER_ERROR: 'An internal server error occurred.',
    },
    validation: {
      MISSING_FIELDS: 'Required fields are missing.',
      INVALID_EMAIL: 'The provided email address is invalid.',
      INVALID_AGE: 'Age must be a positive number.',
    },
  };
  
  module.exports = messages;
  