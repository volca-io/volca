const DI_TYPES = {
  Logger: Symbol.for('Logger'),
  AuthenticationService: Symbol.for('AuthenticationService'),
  UserService: Symbol.for('UserService'),
  ProjectService: Symbol.for('ProjectService'),
  User: Symbol.for('User'),
  Project: Symbol.for('Project'),
  Security: Symbol.for('Security'),
};

export { DI_TYPES };
