jQuery( document ).ready(function($)
{

function updatedates(){
   
    $(".inline-group input.vDateField").attr('value', $("#id_start_0").val());
    fixFields();
}

function fixFields()
{
    $(".inline-group .datetime").each(function(){
        $(".datetimeshortcuts", this).hide();

        for(var i = 0; i < this.childNodes.length; i++)
        {
            if(this.childNodes[i].nodeName == "#text")
                this.childNodes[i].textContent = "";
            else
                $(this.childNodes[i]).hide();
            if(this.childNodes[i].nodeName == "BR")
                return;
        }
    });
}

$("input#id_start_0").change(updatedates);
$("input#id_start_0").focusout(updatedates);
$(".add-row").click(updatedates);

setInterval(fixFields, 50);

});