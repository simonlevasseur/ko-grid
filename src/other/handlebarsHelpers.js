Handlebars.registerHelper('nssg__strOrFn', function(v1, v2){
    if (typeof v1 === "string")
    {
        return v1;
    }
    else
    {
        return v1(v2);
    }
})