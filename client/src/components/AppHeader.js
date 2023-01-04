import { useState } from "react";

function showFilter(){
    const forfilter = document.getElementsByClassName('for_filter')[0];
    forfilter.style.display = 'block';
}
function hideFilter(){
    const forfilter = document.getElementsByClassName('for_filter')[0];
    forfilter.style.display = 'none';
}


const AppHeader = (props) => {
    let categories_checked = [];
    let brands_checked = [];
    let i = 0;
    let p = 0;
    while(i < props.categories.length){
        categories_checked.push(false);
        i++;
    }
    while(p < props.brands.length){
        brands_checked.push(false);
        p++;
    }

    

    const [search, setSearch] = useState();
    const [checked_category, setCheckedCategory] = useState(categories_checked);
    const [checked_brand, setCheckedBrand] = useState(brands_checked);



    function putOptions_forFilter(options, what){
        let checked;
        if (what === 'category'){
            checked = checked_category;
        }
        else if (what==='brand'){
            checked = checked_brand;
        }
        const arrayofOptions = options.map((option, index)=>{
            return (
                <div className="check_filter" key={index}>
                <label>
                    <input type="checkbox" onChange={() => handleChecked(index, what)} checked={checked[index]}/>
                    {option}
                </label>
                </div>
            )
        })
    
        return arrayofOptions;
    }

    
    const handleChecked = (index, what) => {  
        let checked;
        if (what === 'category'){
            checked = [...checked_category];
            checked[index] = !checked[index];
            setCheckedCategory(checked);
        }
        else if (what==='brand'){
            checked = [...checked_brand];
            checked[index] = !checked[index];
            setCheckedBrand(checked);
        }
    }

    const filterFunc = () => {
        let forFilter = [];
        hideFilter();
        for (const i in checked_category){
            if (checked_category[i]){
                forFilter.push(props.categories[i]);
            }
        }

        for (const i in checked_brand){
            if (checked_brand[i]){
                forFilter.push(props.brands[i]);
            }
        }
        if (forFilter.length){
            props.filterFunc(forFilter);
        }
    }

    const cancelFilter = () => {
        hideFilter();
        setCheckedCategory(categories_checked);
        setCheckedBrand(brands_checked);
    }

    return (
        <>
        <header className="App-header">
        <div className="divtext-header">
          <h1 className="text-header">E-commerce</h1>
        </div>
          <div className="userDo">
            <h3 className="text_hiding" >Options</h3>
            <div className="hiding_buttons_userDo">
                <div className="buttons_userDo">
                    <a href="/product/create" className="userDo_href">Create</a>
                </div>
                <div className="buttons_userDo">
                    <a href="/" className="userDo_href">Edit</a>
                </div>
                <div className="buttons_userDo">
                    <a href="/" className="userDo_href">Delete</a>
                </div>
                  
            </div>
            <div className="div_search">
                <button className="logosearch" onClick={() => props.searchFunc(search)}>
                    <img className="logosearch_img" src={require("./search.png").default} alt="none" width="15" height="15"/>
                </button>

                <input className="search" type="text" value={search} onChange={(event)=> setSearch(event.target.value)} placeholder="search"/>
            
                <button className="logofilter" onClick={showFilter}>
                    <img className="logofilter_img" src={require("./filter.png").default} alt="nothing" width="15" height="15"/>
                </button>
                
                <div className="for_filter">
                    <h3 className="forFilter_titleOption">Category</h3>
                    <div className="content-options">
                        {putOptions_forFilter(props.categories, 'category')}
                    </div>
                    
                    <h3 className="forFilter_titleOption">Brand</h3>
                    <div className="content-options">
                        {putOptions_forFilter(props.brands, 'brand')}
                    </div>
                    <button className="button_forCancelFilter" onClick={cancelFilter}>Cancel</button>
                    <button className="button_forFilter" onClick={filterFunc}>Filter</button>
                </div>
            </div>

            
          </div>

      </header>
        </>
    )
}

export default AppHeader;