const toCurrency = (val) => {
  return new Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(val);
}

const buildSortByUrl = (sortArr) => {
    let sortUrl = "";
    sortArr.forEach(function(sortObj) {
      let sortDir = "ASC";
      if(sortObj.desc){
        sortDir = "DESC";
      }
      sortUrl += "&order="+sortObj.id+" "+sortDir;
    });
    return sortUrl;
 }

 const buildFilterUrl = (filterArr) => {
  let filterUrl = "";
  filterArr.forEach(function(filterObj) {
    let filterOpr = "=";
    filterOpr = "like";
    let filterClm = filterObj.id;
    let filterVal = filterObj.value;
    if(Array.isArray(filterVal) && filterVal.length > 0){
      let multifilterOpr = "IN";
      let isNullFlag = false;
      let selOptionSt = Array.from(filterVal).map(o => { 
        if(o.value==="is NULL"){
          isNullFlag = true;
        } else {
          return ("'"+o.value+"'");
        }
      }).filter(Boolean).join(",");
      if(selOptionSt.length > 0 && isNullFlag===false){
        filterUrl += " and ("+filterClm+" "+multifilterOpr+" ("+selOptionSt+"))";
      }
      ///
      if(selOptionSt.length > 0 && isNullFlag===true){
        filterUrl += " and (("+filterClm+" "+multifilterOpr+" ("+selOptionSt+"))";
        filterUrl += " or ("+filterClm+" is null))";
      }
      ////
      if(isNullFlag===true && selOptionSt.length === 0){
        filterUrl += " and ("+filterClm+" is null)";
      }
    } else {
      if(filterClm==="ALDLoanApplicationNumberOnly" || filterClm==="TaxID" || filterClm==="sentDateTime"){
        filterOpr = "=";
        filterUrl += " and ("+filterClm+" "+filterOpr+" "+filterVal+")";
      } else if(filterClm==="SBALoanNumber" && filterObj.filterOpr===">" && filterObj.defFilter==="teamc"){
        filterOpr = filterObj.filterOpr;
        filterUrl += " and ("+filterClm+" "+filterOpr+" "+filterVal+")";
      } else {
        filterUrl += " and ("+filterClm+" "+filterOpr+" %"+filterVal+"%)";
      }
    }
  });
  if(filterUrl.length>0){
    filterUrl = filterUrl.substring(5);
  }
  filterUrl = encodeURIComponent(filterUrl);
  console.log("filterUrl : "+filterUrl);
  return filterUrl;
}

 const buildPageUrl = (pageSize, pageIndex) => {
    let pageUrl = "";
    //let startRow = (pageSize * pageIndex) + 1;
    let startRow = pageSize * pageIndex;
    //const endRow = startRow + pageSize;
    pageUrl += "?limit="+pageSize;
    pageUrl += "&offset="+startRow;
    return pageUrl;
 }

 export { buildSortByUrl, buildPageUrl, buildFilterUrl } ; 