let data
function init(){
    data={
        field_block:{
            template:"narrow-table",
            fields:[
                {
                    type: "textbox",
                    label: "First Name",
                    value: "Gove",
                    id: "first_name"
                    
                },
                {
                    type: "textbox",
                    label: "Last Name",
                    value: "Allen",
                    id: "last_name"
                    
                },
                {
                    type: "textbox",
                    label: "Email Address",
                    value: "gove@colonialheritage.org",
                    id: "email"
                    
                }
            ]
        }
    }
    
    for(const tag of document.body.getElementsByTagName("*")){
        if(tag.id.startsWith("render:")){
            const ids=tag.id.split(":")
            let obj=data
            
            for(let x=1;x<ids.length;x++){
                console.log(ids[x])
                obj=obj[ids[x]]
            }

            addHtmlIds(data, "data")
            console.log("data",data, obj)
            van.add(tag, render(obj.template, obj.fields))

        }
    }
}




function addHtmlIds(obj, prefix){
    obj.htmlId=prefix
    for (const key in obj){
      if (Object.prototype.hasOwnProperty.call(obj, key)){
        const value = obj[key];
        if (typeof value === 'object' && value !== null){
          
            addHtmlIds(value, prefix + ":" + key); // Recursively iterate over nested objects
        } else {
          // Handle non-object values (e.g., strings, numbers)
          console.log(`${key}: ${value}`);
        }
      }
    }
}



function updateDataObject(obj){
    for (const key in obj){
      if (Object.prototype.hasOwnProperty.call(obj, key)){
        const value = obj[key];
        if (typeof value === 'object' && value !== null){
            if(value.id && value.value){
                //Object has an id and a value, update it from html
                value.value=document.getElementById(value.htmlId).value

            }
            updateDataObject(value); // Recursively iterate over nested objects
        } else {
          // Handle non-object values (e.g., strings, numbers)
          console.log(`${key}: ${value}`);
        }
      }
    }
}

function removeHtmlIds(obj){
    for (const key in obj){
      if (Object.prototype.hasOwnProperty.call(obj, key)){
        const value = obj[key];
        if (typeof value === 'object' && value !== null){
            delete value.htmlId
            removeHtmlIds(value); // Recursively iterate over nested objects
        } else {
          // Handle non-object values (e.g., strings, numbers)
          console.log(`${key}: ${value}`);
        }
      }
    }
}





function save(){
    updateDataObject(data)
    const payload=JSON.parse(JSON.stringify(data))

    console.log("payload",payload)
}
function render(template, object){
    
    return window["template_"+template.split("-").join("_")](object)
    
}

function template_narrow_field(object){
    const {div, label, input} = van.tags
    const editor = div()
    if(object.type==="textbox"){
      van.add(editor, label({class:"narrow-field",for:object.id},object.label) )
      console.log("o", object)
      van.add(editor, input({value:object.value, id:object.htmlId}) )
    }
    return editor
}

function template_narrow_table(object){
    console.log("template_narrow_table", object)
    const {div} = van.tags
    const editor = div()
    for(const field of object){
      van.add(editor, template_narrow_field(field) )
    }
    return editor
}