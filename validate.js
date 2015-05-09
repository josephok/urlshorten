module.exports = function (strURL) { 
    var strRegex = '^(?:http|ftp)s?://'
        +'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|'
        +'localhost|'
        +'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'
        +'(?::\d+)?'
        +'(?:/?|[/?]\S+)$';  
        
    var re = new RegExp(strRegex, "i");  
    if (re.test(strURL)) { 
        return (true);  
    } else {  
        return (false);
    }
}