d3.json("https://raw.githubusercontent.com/CMDA/Frontend-3/master/src/data/data_rijksmonumenten.json", function(error, data){
    const dataRes = data.response.docs;
    for(let i = 0; i < dataRes.length; i++) {
      console.table(dataRes[i]);

      document.querySelector(".data").appendChild("li");
    }
    // document.querySelector(".data").innerHTML = JSON.stringify(data, {indent: true});
});
