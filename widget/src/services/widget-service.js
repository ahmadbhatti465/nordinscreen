const { WidgetRepository } = require('../database');
const { FormateData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } = require('../utils');
const { NotFoundError, ValidationError } = require('../utils/errors/app-errors');

// All Business logic will be here
class WidgetService {
    constructor() {
        this.repository = new WidgetRepository();
    }

    async createWidget({ name, type, userId, groupsIds }) {
        let widget = await this.repository.createWidget({ name, type, userId, groupsIds });
        if (!widget) throw new ValidationError('widget not created');
        return widget;
    }

    async getWidgets({ userId }) {
        const widgets = await this.repository.getWidgets(userId);
        if (!widgets) throw new NotFoundError('widgets not found');
        return widgets;
    }

    async getWidgetByToken(token) {
        const widget = await this.repository.getWidgetByToken(token);
        if (!widget) throw new NotFoundError('widget not found');
        return widget;
    }

    async updateWidget({ id, name, type, userId, groupsIds }) {
        const widget = await this.repository.updateWidget({ id, name, type, userId, groupsIds });
        if (!widget) throw new NotFoundError('widget not found');
        return widget;
    }

    async deleteWidget(userInputs) {
        const { id, userId } = userInputs;
        const widget = await this.repository.deleteWidget(id, userId);
        if (!widget) throw new NotFoundError('widget not found');
        return widget;
    }
    

    async SubscribeEvents(payload) {

        console.log('Triggering.... Widget Events');

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

module.exports = WidgetService;