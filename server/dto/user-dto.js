class UserDto {
    username;
    id;
    isActivated;
    role

    constructor(model) {
        this.username = model.username;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.role = model.role
    }
}

export default UserDto