var mongoose = require('mongoose')
var schema = mongoose.Schema


var CategorySchema = new schema({
    category: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true })

var ProductsSchema = new schema({
    categoryId: { type: schema.Types.ObjectId, ref: 'categories' },
    product: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true })

var CategoryInfo = mongoose.model('categories', CategorySchema)
var ProductsInfo = mongoose.model('products', ProductsSchema)

module.exports = { CategoryInfo, ProductsInfo }