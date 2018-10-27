// LOADS ON PAGE READY
jQuery(document).ready(function(){
    //INITIALIZING VARIABLES + RETRIEVING FROM MEMORY
    GetFromStorage();
    var fieldName = 'quantity';
    var colorName = null;
    var sizeName = null;
    function addListeners() {
      // INCREMENT FUNCTION --> ADDS TO QUANTITY VALUES ON CLICK
      $(".add-quantity-button").click(function(){
          fieldName = $(this).attr('field');
          console.log(fieldName);
          var currentVal = parseInt($('input[name='+fieldName+']').val());
          // IF VALUE IS NOT UNDEFINED
          if (!isNaN(currentVal)) {
              // INCREMENT FIELD VALUE
              $('input[name='+fieldName+']').val(currentVal + 1);
              // CHECK IF FIELD IS ON THE CART PAGE OR PRODUCT PAGE
              if (fieldName !== 'quantity') {
                // PULL ITEM ENTRY FROM MEMORY
                var cartStorage = GetFromStorage();
                var item = cartStorage[fieldName];
                // UPDATE QTY VALUE
                cartStorage[fieldName].qty = (item.qty+1);
                // SET ITEM VALUE
                localStorage.setItem('STORAGE', JSON.stringify(cartStorage));

                console.log(item);
              }
          }

          else {
              // OTHERWISE PUT A ZERO THERE
              $('input[name='+fieldName+']').val(0);
          }
          // UPDATE SUBTOTAL AND NUMBER OF ITEMS IN CART
          CalcSubTotal();
          CalcCartCount();
      });

      // INCREMENT FUNCTION --> SUBTRACTS QUANTITY VALUES ON CLICK UNTIL 1
      $(".sub-quantity-button").click(function() {
          fieldName = $(this).attr('field');
          console.log(fieldName);
          // GET CURRENT VALUE
          var currentVal = parseInt($('input[name='+fieldName+']').val());
          // IF VALUE ISN'T UNDEFINED AND GREATER THAN 1
          if (!isNaN(currentVal) && currentVal > 1) {
              // DECREMENT BY 1
              $('input[name='+fieldName+']').val(currentVal - 1);
              // CHECK WHETHER FIELD IS ON THE CART PAGE OR THE PRODUCT PAGE
              if (fieldName !== 'quantity') {
                // PULL ITEM ENTRY FROM MEMORY
                var cartStorage = GetFromStorage();
                var item = cartStorage[fieldName];
                // UPDATE QTY VALUE
                cartStorage[fieldName].qty = (item.qty-1);
                // SET ITEM
                localStorage.setItem('STORAGE', JSON.stringify(cartStorage));
                console.log(item);
              }
          } else {
              // OTHERWISE PUT A 1 THERE
              $('input[name='+fieldName+']').val(1);
          }
          // UPDATE SUBTOTAL AND NUMBER OF ITEMS IN CART
          CalcSubTotal();
          CalcCartCount();
      });

      // COLOR SELECTOR BUTTON
      $(".color-image-thumbnail-holder").click(function() {
          colorName = $(this).attr("color");
          $("#product-image-main").attr("src", "assets/" + colorName + ".png");
          $("#color-label").text(colorName);
          console.log(colorName);
          // CHECKS IF USER HAS ENTERED BOTH COLOR AND SIZE
          cartIsValid();
          return colorName;
      });
      // SIZE SELECTOR BUTTONS
      $(".size-button").click(function() {
          sizeName = $(this).attr("size");
          $("#size-label").text(sizeName);
          console.log(sizeName);
          // CHECKS IF USER HAS ENTERED BOTH COLOR AND SIZE
          cartIsValid();
          return sizeName;
      });

      // CREATE NEW ITEM, ADD TO LOCAL STORAGE, PASS TO CART
      $('#addtocart-button').click(function() {
        // ITEM CONSTRUCTOR
        function item(name, size, color, qty, price) {
          this.name = name;
          this.size = size;
          this.color = color;
          this.qty = qty;
          this.price = price;
        }

        // CREATE NEW ITEM
        var newItem = new item($(".product-title").text(), $("#size-label").text(), $("#color-label").text(), parseInt($('input[name='+fieldName+']').val()), parseFloat($("#product-price #price-label").text()));

        // CHECKS IF USER HAS SELECTED SIZE AND COLOR BEFORE ADDING
        if ((newItem.color !== "" && newItem.size !== "")) {
          var cartItems = GetFromStorage();
          cartItems.push(newItem);
          localStorage.setItem('STORAGE', JSON.stringify(cartItems));
          console.log('WRITTEN TO STORAGE');
          console.log(GetFromStorage());
          // UPDATE NUMBER OF ITEMS IN CART
          CalcCartCount();
        }
      });
    }

    function onReady() {
      // RETRIEVES ITEM OBJECT FROM MEMORY AND CONSTRUCTS NEW HTML IN CART PAGE
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

      // FILLS IN ITEM-SPECIFIC VALUES IN TEMPLATE
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

      // REMOVES ITEM FROM CART, DELETES FROM MEMORY
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
        // UPDATE SUBTOTAL AND NUMBER OF ITEMS IN CART
        CalcSubTotal();
        CalcCartCount();
      });
      // ADDS LISTENERS TO INTERACTIVE OBJECTS IN CART ITEM HTML
      addListeners();
    }

    // RETRIEVES OBJECTS FROM STORAGE
    function GetFromStorage() {
      var storage = localStorage.getItem('STORAGE');
      if (storage) {
        return JSON.parse(storage);
      }
      return[];
    }

    // UPDATES NUMBER OF ITEMS IN CART
    function CalcCartCount() {
      var cartCount = 0;
      var cartStorage = GetFromStorage();
      for (var i = 0; i < cartStorage.length; i++) {
        var item = cartStorage[i];
        cartCount += (item.qty);
      }
      $(".cart-count").text(cartCount);
    }

    // UPDATES CART SUBTOTAL, TAX, TOTAL
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

    // CHECKS IF USER HAS SELECTED BOTH A COLOR AND SIZE, ADJUSTS ADD-TO-CART BUTTON CSS
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
