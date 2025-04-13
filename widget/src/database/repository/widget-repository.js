const mongoose = require('mongoose');
const { WidgetModel } = require('../models')
const uuid = require('uuid');

class WidgetRepository {
    async createWidget({ name, type, userId, groupsIds }) {
        //create token

        const token = uuid.v4();
        const widget = new WidgetModel({
            name,
            type,
            userId,
            token,
            groupsIds,
        });
        const widgetResult = await widget.save();
        return widgetResult;
    }

    async getWidgets(userId) {
        const widgets = await WidgetModel.find({ userId });
        return widgets;
    }

    async getWidgetByToken(token) { 
        const widget = await WidgetModel.findOne({ token });
        return widget;
    }

    async deleteWidget(id, userId) {
        let where = { _id: id};
        if(userId) where.userId = userId
        const deletedWidget = await WidgetModel.findOneAndDelete(where);
        return deletedWidget;
    }

    async updateWidget({ id, name, type, userId, groupsIds}) {
        let where = { _id: id };
        if (userId) where.userId = userId;

        const updatedGroup = await WidgetModel.findOneAndUpdate(where, { name, type, groupsIds }, { new: true });
        return updatedGroup;
    }
}

module.exports = WidgetRepository;