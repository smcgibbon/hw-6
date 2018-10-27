jQuery(document).ready(function(){

    GetFromStorage();
    var fieldName = 'quantity';
    var colorName = null;
    var sizeName = null;
    function addListeners() {
      // This button will increment the value
      $(".add-quantity-button").click(function(){
        console.log("in add click func");
          // Get the field name
          fieldName = $(this).attr('field');
          // Get its current value
          console.log(fieldName);
          var currentVal = parseInt($('input[name='+fieldName+']').val());
          // If is not undefined
          if (!isNaN(currentVal)) {
              // Increment field value
              $('input[name='+fieldName+']').val(currentVal + 1);
              if (fieldName !== 'quantity') {
                // PULL ITEM ENTRY FROM MEMORY
                var cartStorage = GetFromStorage();
                var item = cartStorage[fieldName];
                // UPDATE QTY VALUE
                cartStorage[fieldName].qty = (item.qty+1);
                // SET
                localStorage.setItem('STORAGE', JSON.stringify(cartStorage));

                console.log(item);
              }
          }

          else {
              // Otherwise put a 0 there
              $('input[name='+fieldName+']').val(0);
          }
          CalcSubTotal();
          CalcCartCount();
      });

      // This button will decrement the value till 0
      $(".sub-quantity-button").click(function() {
          console.log("in sub click func");
          // Get the field name
          fieldName = $(this).attr('field');
          console.log(fieldName);
          // Get its current value
          var currentVal = parseInt($('input[name='+fieldName+']').val());
          // If it isn't undefined or its greater than 1
          if (!isNaN(currentVal) && currentVal > 1) {
              // Decrement one
              $('input[name='+fieldName+']').val(currentVal - 1);

              if (fieldName !== 'quantity') {
                // PULL ITEM ENTRY FROM MEMORY
                var cartStorage = GetFromStorage();
                var item = cartStorage[fieldName];
                // UPDATE QTY VALUE
                cartStorage[fieldName].qty = (item.qty-1);
                // SET
                localStorage.setItem('STORAGE', JSON.stringify(cartStorage));
                console.log(item);
              }


          } else {
              // Otherwise put a 1 there
              $('input[name='+fieldName+']').val(1);
          }
          CalcSubTotal();
          CalcCartCount();
      });

      $(".color-image-thumbnail-holder").click(function() {
          colorName = $(this).attr("color");
          $("#product-image-main").attr("src", "assets/" + colorName + ".png");
          $("#color-label").text(colorName);
          console.log(colorName);
          cartIsValid();
          return colorName;
      });

      $(".size-button").click(function() {
          sizeName = $(this).attr("size");
          $("#size-label").text(sizeName);
          console.log(sizeName);
          cartIsValid();
          return sizeName;
      });

      $('#addtocart-button').click(function() {
        function item(name, size, color, qty, price) {
          this.name = name;
          this.size = size;
          this.color = color;
          this.qty = qty;
          this.price = price;
        }

        // var newItem = new item($(".product-title").text(), $("#size-label").text(), $("#color-label").text(), $("#quantity-holder").attr("value"), $("#product-price .price").text());
        var newItem = new item($(".product-title").text(), $("#size-label").text(), $("#color-label").text(), parseInt($('input[name='+fieldName+']').val()), parseFloat($("#product-price #price-label").text()));
        //console.log(newItem);
        if ((newItem.color !== "" && newItem.size !== "")) {
          var cartItems = GetFromStorage();
          cartItems.push(newItem);
          localStorage.setItem('STORAGE', JSON.stringify(cartItems));
          console.log('WRITTEN TO STORAGE');
          console.log(GetFromStorage());
          // var cartItem = JSON.parse('newItem');
          // console.log(cartItem);
          CalcCartCount();
        }
      });
    }

    function onReady() {

      var wrapper = document.getElementById('wrapper');
      var cartStorage = GetFromStorage();
      console.log(cartStorage);
      var template = `
      <li class="cart-row" data-index="ITEM_INDEX">
        <div class="image-holder-cart" "cart-block">
          <img src="assets/ITEM_IMG.png" alt="Dog Backpack" class="cart-image-thumbnail" height=100 width=100>
        </div>
        <div class="product-cart-info cart-block">
          <h4 class="product-title-cart">ITEM_NAME</h4>
          <p><strong>Item No:</strong> 54321 <p>
          <p><strong>Size:</strong> ITEM_SIZE <p>
          <p><strong>Color: </strong>ITEM_COLOR</p>
          <p class="remove-cart"><a class="link-text">Remove Item</a></p>
        </div>
        <div class="cart-block cart-price">
          <span class="price">$ITEM_PRICE</span> </div>
          <form class = "cart-block" id='quantity-selector' method='POST' action='#'>
            <input type='button' value='-' class="sub-quantity-button" field='ADD_FIELD_REF' />
            <input type='text' name='FIELD_REF' value='ITEM_QTY' class='qty' id="quantity-holder-cart" />
            <input type='button' value='+' class="add-quantity-button" field='SUB_FIELD_REF' />
          </form>

        </div>
      </li>`;

      /* <div class="cart-block" id="quantity-selector">
      <button class="sub-quantity-button" field="ADD_FIELD_REF"> - </button>
      <div id="quantity-holder-cart">ITEM_QTY</div>
      <button class="add-quantity-button" field="SUB_FIELD_REF"> + </button>
      */
      for (var i = 0; i < cartStorage.length; i++) {
        var item = cartStorage[i];
        var itemTmpl = template;
        itemTmpl = itemTmpl.replace('ITEM_INDEX', i);
        itemTmpl = itemTmpl.replace('ITEM_NAME', item.name);
        itemTmpl = itemTmpl.replace('ITEM_SIZE', item.size);
        itemTmpl = itemTmpl.replace('ITEM_COLOR', item.color);
        itemTmpl = itemTmpl.replace('ITEM_PRICE', item.price);
        itemTmpl = itemTmpl.replace('ITEM_QTY', item.qty);
        itemTmpl = itemTmpl.replace('ITEM_IMG', item.color);
        itemTmpl = itemTmpl.replace('ITEM_IMG', item.color);
        itemTmpl = itemTmpl.replace('ADD_FIELD_REF', i);
        itemTmpl = itemTmpl.replace('SUB_FIELD_REF', i);
        itemTmpl = itemTmpl.replace('FIELD_REF', i);
        var node = document.createElement("div");
        node.classList.add('item');
        node.innerHTML= itemTmpl;
        if (wrapper !== null) {
          wrapper.appendChild(node);
        }
      }

      $('.remove-cart').click(function() {
        var target = $(this).closest('li');
        var index = null;
        if ($(target).is('.cart-row')) {
          index = $(target).attr('data-index');
          target.remove();
        }
        if (typeof index !== 'undefined' && index !== null) {
          console.log(cartStorage);
          cartStorage.splice(index, 1);
          console.log(cartStorage);
          localStorage.setItem('STORAGE', JSON.stringify(cartStorage));
        }
        CalcSubTotal();
        CalcCartCount();
      });
      addListeners();
    }

    function GetFromStorage() {
      var storage = localStorage.getItem('STORAGE');
      if (storage) {
        return JSON.parse(storage);
      }
      return[];
    }

    function CalcCartCount() {
      var cartCount = 0;
      var cartStorage = GetFromStorage();
      for (var i = 0; i < cartStorage.length; i++) {
        var item = cartStorage[i];
        cartCount += (item.qty);
      }
      $(".cart-count").text(cartCount);
    }

    function CalcSubTotal() {
      var subtotal = 0;
      var tax = 0;
      var total = 0;
      var cartStorage = GetFromStorage();
      for (var i = 0; i < cartStorage.length; i++) {
        var item = cartStorage[i];
        subtotal += ((item.price) * (item.qty));
      }
      tax = (subtotal*0.07);
      total = (subtotal + tax);
      // $("#price-subtotal").replace("0.00", subtotal);
      $("#price-subtotal").text(subtotal.toFixed(2));
      $("#price-tax").text(tax.toFixed(2));
      $("#price-total").text(total.toFixed(2));
    }

    function cartIsValid() {
      if (colorName !== null && sizeName !== null) {
        $('#addtocart-button').css('background-color', '#28E097');
      }
    }

    cartIsValid();
    onReady();
    CalcSubTotal();
    CalcCartCount();

});
