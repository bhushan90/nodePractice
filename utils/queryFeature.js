class QueryFeature {
  constructor(queryParams, query, total = 100) {
    this.queryParams = queryParams;
    this.query = query;
    this.total = total;
    console.log(queryParams);
  }

  page() {
    const page = +this.queryParams.page || 1;
    const count = +this.queryParams.count || this.total;
    const skip = (page - 1) * count;
    this.query = this.query.skip(skip).limit(count);

    return this;
  }

  filter() {
    const excludedParams = ['page', 'count', 'sort', 'fields'];
    const searchQuery = { ...this.queryParams };
    excludedParams.forEach((ex) => {
      delete searchQuery[ex];
    });

    this.query = this.query.find(searchQuery);

    return this;
  }

  sort() {
    const { sort } = this.queryParams;
    if (sort) {
      this.query = this.query.sort(sort);
    }
    return this;
  }

  limit() {
    const { fields } = this.queryParams;
    if (fields) {
      const projection = fields.replace(',', ' ');
      this.query = this.query.select(projection);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
}

module.exports = QueryFeature;
