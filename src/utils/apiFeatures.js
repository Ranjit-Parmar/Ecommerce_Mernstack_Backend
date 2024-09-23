export class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query,
            this.queryStr = queryStr
    }

    // Search Product 

    search() {
        
        if (this.queryStr.search) {
            let search = {
                name: {
                    $regex: this.queryStr.search,
                    $options: "i"
                }
            }
            this.query = this.query.find({ ...search });
        }
        return this
    }


    // Filter Product
    filter() {

        // Create shallow copy of query string
        let queryCopy = { ...this.queryStr };
    
        if(queryCopy.category){
           
            let str = ''
            for(let i=0; i<queryCopy.category.length; i++){
               str += queryCopy.category[i]
            }
           let  filterBycategory = str.split(",");
           
            queryCopy.category = filterBycategory;
        }

        if(queryCopy.gender){
            let genderStr = ''
            for(let i=0; i<queryCopy.gender.length; i++){
                genderStr += queryCopy.gender[i]
            }
            let filterByGender = genderStr.split(",");

            queryCopy.gender = filterByGender;
        }
            let excludeFields = ['sort', 'page', 'limit', 'search', 'fields'];

        
        // Remove unwanted query fields
        excludeFields.forEach((el) => delete queryCopy[el]);

        let queryStr = JSON.stringify(queryCopy);

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => {
            return (`$${match}`)
        })
        const queryObj = JSON.parse(queryStr);
        

        this.query = this.query.find(queryObj);
        
       
        

            return this;
    }


    // Sort Product
    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(",").join(" ");
            
            this.query = this.query.sort(sortBy);
        }
        return this
    }

    // limit the fields

    fields() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__v");
        }
        return this
    }

    // Pagination Product

    pagination(productPerPage) {
        
       
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || productPerPage * 1;
        const skip = (page - 1) * limit;

        this.query = this.query.limit(limit).skip(skip);
        return this
    }


}