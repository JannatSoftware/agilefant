
/**
 * Constructor for the UserModel class.
 * @constructor
 * @base CommonModel
 * @see CommonModel#initialize
 */
var UserModel = function UserModel() {
  this.initialize();
  this.persistedClassName = "fi.hut.soberit.agilefant.model.User";
  this.relations = {
    task: [],
    story: [],
    assignment: [],
    team: []
  };
  this.currentData = {
    initials: "",
    fullName: ""
  };
  this.copiedFields = {
      "fullName": "fullName",
      "initials": "initials",
      "loginName": "loginName",
      "email": "email",
      "weekEffort": "weekEffort",
      "enabled":    "enabled",
      "autoassignToTasks": "autoassignToTasks"
  };
  this.classNameToRelation = {
      "fi.hut.soberit.agilefant.model.Story":         "story",
      "fi.hut.soberit.agilefant.model.Task":          "task",
      "fi.hut.soberit.agilefant.model.Team":          "team",
      "fi.hut.soberit.agilefant.model.Assignment":    "assignment"
  };
};

UserModel.prototype = new CommonModel();

UserModel.prototype._setData = function(newData) {
  this.id = newData.id;
  
  if (newData.teams) {
    this._updateRelations(ModelFactory.types.team, newData.teams);
  }
  
};


/**
 * Internal function to send the data to server.
 */
UserModel.prototype._saveData = function(id, changedData) {
  var me = this;
  
  var url = "ajax/storeUser.action";
  var data = {};
  
  if (this.currentData.password1) {
    data.password1 = this.currentData.password1;
    
    // TODO: CHANGE FOR PASSWORD CONFIRM 
    data.password2 = this.currentData.password1;
  }
  
  if (changedData.teamsChanged) {
    jQuery.extend(data, {teamIds: changedData.teamIds, teamsChanged: true});
    delete changedData.teamIds;
    delete changedData.teamsChanged;
  }
  
  jQuery.extend(data, this.serializeFields("user", changedData));
  // Add the id
  if (id) {
    data.userId = id;
  }
  else {
    url = "ajax/storeNewUser.action";
  }
  
  jQuery.ajax({
    type: "POST",
    url: url,
    async: true,
    cache: false,
    data: data,
    dataType: "json",
    success: function(data, status) {
      MessageDisplay.Ok("User saved successfully");  
      me.setData(data);
    },
    error: function(xhr, status, error) {
      MessageDisplay.Error("Error saving user", xhr);
    }
  });
};

UserModel.prototype.reload = function() {
  var me = this;
  jQuery.getJSON(
    "ajax/retrieveUser.action",
    {userId: me.getId()},
    function(data,status) {
      me.setData(data);
      me.callListeners(new DynamicsEvents.EditEvent(me));
    }
  );
};

/*
 * GETTERS AND SETTERS
 */

UserModel.prototype.isAutoassignToTasks = function() {
  return this.currentData.autoassignToTasks;
};

UserModel.prototype.isAutoassignToTasksAsString = function() {
  if (this.currentData.autoassignToTasks) {
    return "true";
  }
  return "false";
};

UserModel.prototype.setAutoassignToTasks = function(assign) {
  this.currentData.autoassignToTasks = assign;
};

UserModel.prototype.getEmail = function() {
  return this.currentData.email;
};

UserModel.prototype.setEmail = function(email) {
  this.currentData.email = email;
};

UserModel.prototype.isEnabled = function() {
  return this.currentData.enabled;
};

UserModel.prototype.setEnabled = function(enabled) {
  this.currentData.enabled = enabled;
};

UserModel.prototype.getFullName = function() {
  return this.currentData.fullName;
};

UserModel.prototype.setFullName = function(fullName) {
  this.currentData.fullName = fullName;
};

UserModel.prototype.getInitials = function() {
  return this.currentData.initials;
};

UserModel.prototype.setInitials = function(initials) {
  this.currentData.initials = initials;
};

UserModel.prototype.getLoginName = function() {
  return this.currentData.loginName;
};

UserModel.prototype.setLoginName = function(loginName) {
  this.currentData.loginName = loginName;
};

UserModel.prototype.getPassword1 = function() {
  return this.currentData.password1;
};

UserModel.prototype.setPassword1 = function(password) {
  this.currentData.password1 = password;
};

UserModel.prototype.getPassword2 = function() {
  return this.currentData.password2;
};

UserModel.prototype.setPassword2 = function(password) {
  this.currentData.password2 = password;
};

UserModel.prototype.getTeams = function() {
  return this.relations.team;
};

UserModel.prototype.setTeams = function(teamIds, teamJson) {
  if (teamJson) {
    $.each(teamJson, function(k,v) {
      ModelFactory.updateObject(v);    
    });
  }
  this.currentData.teamIds = teamIds;
  this.currentData.teamsChanged = true;
};

UserModel.prototype.getWeekEffort = function() {
  return this.currentData.weekEffort;
};

UserModel.prototype.setWeekEffort = function(weekEffort) {
  this.currentData.weekEffort = weekEffort;
};



