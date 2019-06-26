const Controller = require('./Controller');
const ObjectId = require('mongodb').ObjectID;
const CategoryInfo = require('../models/MainSchema').CategoryInfo;
const ProductsInfo = require('../models/MainSchema').ProductsInfo;
const Model = require('../models/Model');
const CF = require('../services/CommonServices');

class MainController extends Controller {
    constructor() {
        super();
    }
    /********************************************************
      Purpose: Add Or Update Category
      Parameter:
         {
          content-type : "application/json",
          headers : {},
          body : {
                         "category":"category3",
                   "categoryId":"5d137f1e61ead125c3d344dc"  //For updatecategory only
                },
         params : {}
    }
     Return: JSON String
     ********************************************************/
    async addOrUpdateCategory() {
        let _this = this;
        try {
            let requiredFields = ['category'];
            let checkAllRequiredFields = await CF.checkAllRequiredFields(_this.req.body, requiredFields);
            if (checkAllRequiredFields.isEmpty) return _this.res.send({ status: 0, message: checkAllRequiredFields.message, statusCode: 501 });
            let savedObject = await checkAllRequiredFields.savedObject;
            if (!_this.req.body.categoryId) {
                let existedCategory = await CategoryInfo.findOne(savedObject)
                if (existedCategory) return _this.res.send(await CF.getErrorMessage(0, "This category name is already existed,please try another.", 500));
                let addCategory = await new Model(CategoryInfo).store(savedObject);
                if (!addCategory) return _this.res.send(await CF.getErrorMessage(0, "Category data is not added.", 500));
                return _this.res.send(await CF.getSuccessMessage(1, "Success.", 500, { addCategory }));
            } else {
                let findCategory = await CategoryInfo.findOne({ _id: ObjectId(_this.req.body.categoryId), isDeleted: false })
                if (!findCategory) return _this.res.send(await CF.getErrorMessage(0, "This category is not existed.", 500));
                let existedCategory = await CategoryInfo.findOne({ _id: { $nin: [ObjectId(_this.req.body.categoryId)] }, category: _this.req.body.category })
                if (existedCategory) return _this.res.send(await CF.getErrorMessage(0, "This category name is already existed,please try another.", 500));
                let updateCategory = await CategoryInfo.findOneAndUpdate({ _id: ObjectId(_this.req.body.categoryId) }, { category: _this.req.body.category })
                if (!updateCategory) return _this.res.send(await CF.getErrorMessage(0, "Category data is not updatede.", 500));
                return _this.res.send(await CF.getSuccessMessage(1, "Success.", 500, { updateCategory }));
            }

        } catch (error) {
            console.log("error====", error)
            error = await JSON.parse(JSON.stringify(error));
            return _this.res.send(await CF.getErrorMessage(0, "Internal server error.", 500));
        }
    }

    /********************************************************
     Purpose: All Categories list  with correspoding products along with pagination
     Parameter:
        {
         content-type : "application/json",
         headers : {},
         body : {
                      	"page":"1",
                        "limit":"10",
                        "order": -1 or 1   //for scending or ascending order of data
               },
        params : {}
   }
    Return: JSON String
    ********************************************************/

    async listCategory() {
        let _this = this;
        try {
            let requiredFields = ['page', 'limit'];
            let checkAllRequiredFields = await CF.checkAllRequiredFields(_this.req.body, requiredFields);
            if (checkAllRequiredFields.isEmpty) return _this.res.send({ status: 0, message: checkAllRequiredFields.message, statusCode: 501 });
            // let savedObject = await checkAllRequiredFields.savedObject;

            let page = Number(_this.req.body.page);
            let limit = Number(_this.req.body.limit);
            let order = -1;
            if (_this.req.body.order) { order = _this.req.body.order; }
            let skip = (page - 1) * limit;
            let sort = { _id: order };
            if (_this.req.body.sortBy) {
                sort = { [_this.req.body.sortBy]: order }
            }
            let filter = [];
            let initialQuery = { isDeleted: false, };
            filter.push(initialQuery);

            const mainQuery = { $and: filter };

            // let CategoryList = await CategoryInfo.find(mainQuery).sort(sort).skip(skip).limit(limit);
            let CategoryList = await CategoryInfo.aggregate([
                { $match: mainQuery },
                {
                    $lookup: {
                        "from": "products",
                        "let": { "id": "$_id" },
                        "pipeline": [
                            { "$match": { "$and": [{ "$expr": { "$eq": ["$categoryId", "$$id"] } }] } },
                            { $project: { "product": 1, } }
                        ],
                        "as": "products"
                    }
                },
                { $project: { "products": 1, "category": 1, "createdAt": 1 } }
            ])
            let total = await CategoryInfo.count(mainQuery)
            let nextPage = await CF.getNextPage(page, limit, total);
            return _this.res.send(await CF.getSuccessMessage(1, "Category list.", 500, { page, limit, total, nextPage, CategoryList }));

        } catch (error) {
            console.log("error====", error)
            error = await JSON.parse(JSON.stringify(error));
            return _this.res.send(await CF.getErrorMessage(0, "Internal server error.", 500));
        }
    }
    /********************************************************  
     Purpose: Add product to category
     Parameter:
        {
         content-type : "application/json",
         headers : {},
         body : {
                           "categoryId":"5d137ef961ead125c3d344da",
                           "product":"product13"
               },
        params : {}
        }
    Return: JSON String
    ********************************************************/
    async addProduct() {
        let _this = this;
        try {
            let requiredFields = ['categoryId', 'product'];
            let checkAllRequiredFields = await CF.checkAllRequiredFields(_this.req.body, requiredFields);
            if (checkAllRequiredFields.isEmpty) return _this.res.send({ status: 0, message: checkAllRequiredFields.message, statusCode: 501 });
            let savedObject = await checkAllRequiredFields.savedObject;

            let findCategory = await CategoryInfo.findOne({ _id: ObjectId(_this.req.body.categoryId), isDeleted: false })
            if (!findCategory) return _this.res.send(await CF.getErrorMessage(0, "This category is not existed.", 500));

            let existedCategoryProduct = await ProductsInfo.findOne({ categoryId: ObjectId(_this.req.body.categoryId), product: _this.req.body.product })
            if (existedCategoryProduct) return _this.res.send(await CF.getErrorMessage(0, "This product name is already existed with given category,please try another.", 500));
            let addProduct = await new Model(ProductsInfo).store(savedObject);
            if (!addProduct) return _this.res.send(await CF.getErrorMessage(0, "Product data is not added.", 500));
            return _this.res.send(await CF.getSuccessMessage(1, "Product data is added.", 500, { addProduct }));
        } catch (error) {
            console.log("error====", error)
            error = await JSON.parse(JSON.stringify(error));
            return _this.res.send(await CF.getErrorMessage(0, "Internal server error.", 500));
        }
    }

    /********************************************************
        Purpose: All products list or products list by Category with pagination
        Parameter:
           {
            content-type : "application/json",
            headers : {},
            body : {
                               "page":"1",
                           "limit":"10",
                           "order": -1 or 1   //for scending or ascending order of data
                  },
           params : {}
      }
       Return: JSON String
       ********************************************************/
    async listProducts() {
        let _this = this;
        try {
            let requiredFields = ['page', 'limit'];
            let checkAllRequiredFields = await CF.checkAllRequiredFields(_this.req.body, requiredFields);
            if (checkAllRequiredFields.isEmpty) return _this.res.send({ status: 0, message: checkAllRequiredFields.message, statusCode: 501 });
            // let savedObject = await checkAllRequiredFields.savedObject;

            let page = Number(_this.req.body.page);
            let limit = Number(_this.req.body.limit);
            let order = -1;
            if (_this.req.body.order) { order = _this.req.body.order; }
            let skip = (page - 1) * limit;
            let sort = { _id: order };
            if (_this.req.body.sortBy) {
                sort = { [_this.req.body.sortBy]: order }
            }
            let filter = [];
            let initialQuery = { isDeleted: false, };
            filter.push(initialQuery);
            if (_this.req.body.categoryId) filter.push({ categoryId: ObjectId(_this.req.body.categoryId) });

            const mainQuery = { $and: filter };

            let ProductsList = await ProductsInfo.find(mainQuery).sort(sort).skip(skip).limit(limit);
            let total = await ProductsInfo.count(mainQuery)
            let nextPage = await CF.getNextPage(page, limit, total);
            return _this.res.send(await CF.getSuccessMessage(1, "Category list.", 500, { page, limit, total, nextPage, ProductsList }));

        } catch (error) {
            console.log("error====", error)
            error = await JSON.parse(JSON.stringify(error));
            return _this.res.send(await CF.getErrorMessage(0, "Internal server error.", 500));
        }
    }

    /********************************************************
     Purpose:Soft Delete single or multiple categories and its corresponding products at a time
     Parameter:
        {
         content-type : "application/json",
         headers : {},
         body : {
                       "categoryIds": ["5d137ef961ead125c3d344da"]
               },
        params : {}
   }
    Return: JSON String
    ********************************************************/
    async softDeleteCategory() {
        let _this = this;
        try {
            let requiredFields = ['categoryIds'];
            let checkAllRequiredFields = await CF.checkAllRequiredFields(_this.req.body, requiredFields);
            if (checkAllRequiredFields.isEmpty) return _this.res.send({ status: 0, message: checkAllRequiredFields.message, statusCode: 501 });
            // let savedObject = await checkAllRequiredFields.savedObject;

            let categoryIds = [];
            _this.req.body.categoryIds.filter((i) => {
                categoryIds.push(ObjectId(i));
            });
            let deleteCategoryFilter = { _id: { $in: categoryIds }, isDeleted: false }
            let deleteProductsFilter = { categoryId: { $in: categoryIds } }

            let findData = await await CategoryInfo.find(deleteCategoryFilter)
            if (!findData) return _this.res.send(await CF.getErrorMessage(0, "No data found!.", 500));

            let deleteCategory = await CategoryInfo.updateMany(deleteCategoryFilter, { $set: { isDeleted: true } })
            if (!deleteCategory) return _this.res.send(await CF.getErrorMessage(0, "Category data is not deleted.", 500));
            let deleteProducts = await ProductsInfo.updateMany(deleteProductsFilter, { $set: { isDeleted: true } })
            let deletedData = {
                noOfMatchedCategories: deleteCategory.n,
                noOfDeletedCategories: deleteCategory.nModified,
                noOfMatchedProducts: deleteProducts.n,
                noOfdeletedProducts: deleteProducts.nModified,
            }
            return _this.res.send(await CF.getSuccessMessage(1, "Success.", 500, { deletedData }));


        } catch (error) {
            console.log("error====", error)
            error = await JSON.parse(JSON.stringify(error));
            return _this.res.send(await CF.getErrorMessage(0, "Internal server error.", 500));
        }
    }

    /********************************************************
    Purpose:Hard Delete single or multiple categories and its corresponding products at a time
    Parameter:
       {
        content-type : "application/json",
        headers : {},
        body : {
                    "categoryIds": ["5d137ef961ead125c3d344da"]
              },
       params : {}
  }
   Return: JSON String
   ********************************************************/
    async hardDeleteCategory() {
        let _this = this;
        try {
            let requiredFields = ['categoryIds'];
            let checkAllRequiredFields = await CF.checkAllRequiredFields(_this.req.body, requiredFields);
            if (checkAllRequiredFields.isEmpty) return _this.res.send({ status: 0, message: checkAllRequiredFields.message, statusCode: 501 });
            // let savedObject = await checkAllRequiredFields.savedObject;

            let categoryIds = [];
            _this.req.body.categoryIds.filter((i) => {
                categoryIds.push(ObjectId(i));
            });
            let deleteCategoryFilter = { _id: { $in: categoryIds }, isDeleted: false }
            let deleteProductsFilter = { categoryId: { $in: categoryIds } }

            let findData = await await CategoryInfo.find(deleteCategoryFilter)
            if (!findData) return _this.res.send(await CF.getErrorMessage(0, "No data found!.", 500));

            let deleteCategory = await CategoryInfo.remove(deleteCategoryFilter)
            if (!deleteCategory) return _this.res.send(await CF.getErrorMessage(0, "Category data is not deleted.", 500));
            let deleteProducts = await ProductsInfo.remove(deleteProductsFilter)
            let deletedData = {
                noOfMatchedCategories: deleteCategory.n,
                noOfDeletedCategories: deleteCategory.deletedCount,
                noOfMatchedProducts: deleteProducts.n,
                noOfdeletedProducts: deleteProducts.deletedCount,
            }
            return _this.res.send(await CF.getSuccessMessage(1, "Success.", 500, { deletedData }));

        } catch (error) {
            console.log("error====", error)
            error = await JSON.parse(JSON.stringify(error));
            return _this.res.send(await CF.getErrorMessage(0, "Internal server error.", 500));
        }
    }
}

module.exports = MainController;