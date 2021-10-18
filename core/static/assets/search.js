// validation function to check for empty values
function validation() {
    let search = document.getElementById('search');
    let post = document.getElementById('posts');
    let comment = document.getElementById('comments');
    let postValid = document.getElementById('postValid');
    let commentValid = document.getElementById('commentValid');
    if (search.value == '') {
        search.style.border = '2px solid red'
    }
    else {
        search.style.border = '0.6px solid #808080'
    }
    if( post.checked == false && comment.checked == false){
        postValid.style.border = '2px solid red'
        commentValid.style.border = '2px solid red'
    }
    else {
        postValid.style.border = '1px  black'
        commentValid.style.border = '1px  black'
    }
}

// function to clear contents in the results before searching the next result
function clearBox(elementID) {
    document.getElementById(elementID).innerHTML = "";
    document.getElementById(elementID).style = "";
}

//function to change the content according to change in the url
window.onload = () => {
    let url = window.location.href;
    url = url.split('?').pop();
    let sub = url.split('sub=').pop().split('&')[0]
    let searchBar = url.split('q=').pop().split('&')[0];
    let filterBar = url.split('f=').pop();
    //to check the conditions before calling the api
    if (searchBar != '' && (filterBar[0] == "c" || filterBar[0] == "p") && sub != '') {
        validation();
        apiCall(url, sub)
        if (filterBar[0] == 'c') {
            document.getElementById('comments').checked = true
            document.getElementById('posts').checked = false
        }
        else if (filterBar[1] == 'c') {
            document.getElementById('comments').checked = true
            document.getElementById('posts').checked = true
        }
        document.getElementById('search').value = searchBar;
        validation();
    }
}

//function after submit button is clicked
function buttonClick() {
    clearBox('postBox')
    clearBox('commentBox')
    clearBox('pagination')
    clearBox('results')
    // let filter = document.querySelector("input[name='f']:checked").value;
    let search = document.getElementById('search').value;
    let post = document.getElementById('posts');
    let comment = document.getElementById('comments');
    let form = document.getElementById('subreddits').value;
    let filterValue;
    validation();

    //to check the conditions before pushing the url
    if (post.checked && comment.checked) {
        filterValue = 'pc'
        history.pushState(null, "", '/search?f=' + filterValue + '&sub=' + form + '&q=' + search + '&page=1');
    }
    else if (post.checked ) {
        filterValue = 'p'
        history.pushState(null, "", '/search?f=' + filterValue + '&sub=' + form + '&q=' + search + '&page=1');
    }
    else if (comment.checked ) {
        filterValue = 'c'
        history.pushState(null, "", '/search?f=' + filterValue + '&sub=' + form + '&q=' + search + '&page=1');
    }
    let url = window.location.href
    url = url.split('?').pop();
    validation();
    //to check the conditions before calling the api
    if (search != '' && (post.checked || comment.checked)) {
        // console.log('hi')
        apiCall(url)
    }
}

// api call function
function apiCall(url, sub) {
    validation()
    fetch('/api?' + url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            dataCollection(data);
            dataAppender(data, sub);
        });

}

//function to control the data inside the content
function dataCollection(data) {
    let previous = data.prev
    let next = data.next
    let count = data.count
    let paginatedValue = 2
    let totalPage;
    let pageNumber;

    //for result found in the content section 
    if (count != 0) {
        document.getElementById('results').innerHTML += count + ' results found'
    }

    // to find the page number and total pages
    let page = count / paginatedValue
    let precision = page.toPrecision(2);
    if (precision <= 1) {
        totalPage = 1;
    }
    else {
        totalPage = Math.round(precision)
    }
    if (previous == null) {
        pageNumber = 1;
    }
    else if (next == null) {
        pageNumber = previous + 1;
    }
    else {
        pageNumber = next - 1;
    }
    if (count == 0) {
        document.getElementById('pagination').innerHTML += "No results!!!";
        document.getElementById('pagination').style.fontSize = '50px';
    }
    else {
        document.getElementById('pagination').innerHTML += "Page " + pageNumber + " of " + totalPage;
    }
    document.getElementById('pagination').style.display = 'block';

    // to show next,last,previous and first button according to the requirements
    if (count <= paginatedValue) {
        document.getElementById('pagination').style.marginLeft = '150px'
        document.getElementById('next').style.display = 'none';
        document.getElementById('last').style.display = 'none';
        document.getElementById('first').style.display = 'none';
        document.getElementById('previous').style.display = 'none';
    }
    else if (previous == null) {
        document.getElementById('pagination').style.marginLeft = '-30px'
        document.getElementById('next').style.marginLeft = '385px'
        document.getElementById('next').style.display = 'block';
        document.getElementById('last').style.display = 'block';
        document.getElementById('first').style.display = 'None';
        document.getElementById('previous').style.display = 'None';
    }
    else if (next == null) {
        document.getElementById('pagination').style.marginLeft = '233px'
        document.getElementById('first').style.marginLeft = '20px'
        document.getElementById('next').style.display = 'None';
        document.getElementById('last').style.display = 'None';
        document.getElementById('first').style.display = 'block';
        document.getElementById('previous').style.display = 'block';
    }
    else {
        // document.getElementById('pagination').style.marginLeft = '10px'
        document.getElementById('next').style.marginLeft = '130px'
        document.getElementById('first').style.marginLeft = '20px'
        document.getElementById('next').style.display = 'block';
        document.getElementById('last').style.display = 'block';
        document.getElementById('first').style.display = 'block';
        document.getElementById('previous').style.display = 'block';
    }

    //to send href to the a tag of next,last,previousand first according to the page number
    let b = window.location.href
    b = b.replace(/&page.+$/, `&page=${pageNumber + 1}`)
    // console.log(b)
    document.getElementById('next').href = b
    b = b.replace(/&page.+$/, `&page=${totalPage}`)
    document.getElementById('last').href = b
    b = b.replace(/&page.+$/, `&page=${pageNumber - 1}`)
    document.getElementById('previous').href = b
    b = b.replace(/&page.+$/, `&page=1`)
    document.getElementById('first').href = b
}

// function to control readmore and read less inside the div
function myFunction(id) {
    let dots = document.querySelector(` .card[data="${id}"] .dots`);
    let moreText = document.querySelector(`.card[data="${id}"] .more`);
    let btnText = document.querySelector(`.card[data="${id}"] .myBtn`);
    let text = document.querySelector(`.card[data="${id}"] .Text`);


    if (dots.style.display === "none") {
        dots.style.display = "inline";
        btnText.innerHTML = "Read more";
        moreText.style.display = "none";
        text.style.display = 'inline';

    } else {
        dots.style.display = "none";
        btnText.innerHTML = "Read less";
        moreText.style.display = "inline";
        text.style.display = 'none';

    }

}

//used to append div inside the data appender function
let getElementFromString = (string) => {
    let div = document.createElement('div');
    div.innerHTML = string;
    return div.firstElementChild;
}

// function to append the div inside the content according to the results
function dataAppender(data, _sub) {
    let datas = data.data
    let title;
    let type;
    let post_id;
    let comment_id;
    let text;
    let username;
    let createDate;
    let deleteDate;
    let imageUrl;
    let upVotes;
    let sub = _sub;
    for (var i = 0; i < datas.length; i++) {
        type = datas[i].type;
        post_id = datas[i].post_id;
        comment_id = datas[i].comment_id;
        text = datas[i].text;
        let shortText = text.slice(0, 150)

        createDate = datas[i].create_date;
        let date;
        let hour;
        let minutes;
        if (createDate == null){
            date = ''
            hour = ''
            minutes = ''
        }
        else{
            date = createDate.slice(0, 10)
            date = date.replace(/(\d{4})-(\d\d)-(\d\d)/, "$3-$2-$1")
            hour = createDate.split('T').pop().split(':')[0]
            minutes = createDate.slice(13, 16)
            minutes = minutes + ' | '
        }

        let deldate;
        let delhour;
        let delminutes ;
        deleteDate = datas[i].delete_date;
        if (deleteDate == null){
            deldate = ''
            delhour = ''
            delminutes = ''
        }
        else{
            deldate = deleteDate.slice(0, 10)
            deldate = deldate.replace(/(\d{4})-(\d\d)-(\d\d)/, "$3-$2-$1")
            delhour = deleteDate.split('T').pop().split(':')[0]
            delminutes = deleteDate.slice(13, 16)
            delminutes = delminutes + ' | '
        }

        imageUrl = datas[i].image_url;
        
        upVotes = datas[i].upvotes;
        username = datas[i].username;
        title = datas[i].title;
        // According to the types if both are called together
        if (type == 'post') {
            let box2 = document.getElementById('postBox');
            let string2 = `<div class="post-comments card"  data=${post_id} >
            <p class="meta">
    
            <!--                    COMMENT OR POST ICON -->
                <i class="far fa-newspaper"
                   style="font-size: 1.4rem!important; margin-right: 10px;">
                </i>
    
                <!--                    USERNAME -->
                <i class="fas fa-user"></i>
                <a href="https://reddit.com/u/${username}" target="_blank" class="a-comment">
                <span class="">${username}</span>
                </a>
                <span class="mx-1">|</span>
                
    <!--                     REDDIT LINK-->
    <i class="fas fa-sign-out-alt"></i>
    <a href="https://reddit.com/r/${sub}/comments/${post_id}" target="_blank" class="a-comment">
    <span class="">View on Reddit</span>
    </a>
            </p>
            <div class="row">
            
            <!--                    THUMBNAIL -->
                <div class="col-3  text-center">
                <img class="img thumbnail" width='75px' height="55px"
                src="${imageUrl}"  onerror="this.src='data:image/jpeg;base64,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';"/>
                    <p class="text-muted mb-0 p-0 me-5 ">
                    </p>
                    <small class="mx-1 text-muted mb-0 p-0 "><i class="fas fa-thumbs-up"></i></small>
                    <small class="me-3 text-muted mb-0 p-0" >${upVotes}</small>
                    </div>
    
                <div class="col-9">
                <!--                FULL CONTENT -->
    
                    <div style="font-weight: bold;">
                    ${title}
                   </div>
                   <span id="postContent" class="full-content Text text-break"  >
                   <span class="dots"> ...</span>
                    </span>
                    
    <!--                DOTS -->
                   <span class="more"  style = "display:none">${text}</span>
                   
    
    <!--                READ MORE AND DATE -->
    <div class="text-end mt-4 mx-2" style="font-size: 0.9rem;">
    <span class="text-muted" data-bs-toggle="tooltip" data-bs-placement="top" title="Created Date" style="font-size: 12px;">
          ${date} ${hour}${minutes}               
    </span>
    <span class="text-muted" data-bs-toggle="tooltip" data-bs-placement="top" title="Deleted Date" style="font-size: 12px;">
        ${deldate} ${delhour}${delminutes} 
        </span>
                        <button   class="nav-toggle text-muted mx-2  border-0 myBtn" style="margin-left: -30px; cursor: pointer;" onclick="myFunction('${post_id}')"  >
                        Read More
                        </button>
                            </div>
                </div>
                </div>
        </div>`
            let postElement = getElementFromString(string2);
            // console.log(parameterElement);
            box2.appendChild(postElement);
        }
        else if (type == 'comment') {

            let box1 = document.getElementById('commentBox');
            let string1 = `<div class="post-comments card" data=${comment_id}>
                <p class="meta">
                
    <!--                    COMMENT OR POST ICON -->
                    <i class="far fa-comments"
                    style="font-size: 1.4rem!important; margin-right: 10px;">
                    </i>
                    
    <!--                    USERNAME -->
    <i class="fas fa-user"></i>
                    <a href="https://reddit.com/u/${username}" target="_blank" class="a-comment">
                    <span class="">${username}</span>
                    </a>
                    <span class="mx-1">|</span>
    
    <!--                     REDDIT LINK-->
    <i class="fas fa-sign-out-alt"></i>
    <a href="https://reddit.com/r/${sub}/comments/${post_id}/_/${comment_id}" target="_blank" class="a-comment">
                        <span class="">View on Reddit</span>
                    </a>
                    </p>
    
                    
                        
                        
                    
    <!--                FULL CONTENT -->
            <span id="commentContent"  class="full-content text-break Text mb-3"  >
            ${shortText}
            <span class="dots"> ...</span>
            </span>
    
            <!--                DOTS -->
            <span class="more mb-3"  style = "display:none" >${text}</span>
            
               
            
    <!--                READ MORE AND DATE -->
    
                       
                <div class="text-end mt-1 mx-2" style="font-size: 0.9rem;">
                <p class ="  float-start">
                <small class="mx-1 "><i class="fas fa-thumbs-up"></i></small>
                  <small class="mt-1 ">${upVotes}</small>
                </p>
                <span class="text-muted" data-bs-toggle="tooltip" data-bs-placement="top" title="Created Date" style="font-size: 12px;">
                        ${date} ${hour}${minutes}
                        </span>
                        <span class="text-muted" data-bs-toggle="tooltip" data-bs-placement="top" title="Deleted Date" style="font-size: 12px;">
                        ${deldate} ${delhour}${delminutes} 
                            </span>
                    <button   class="nav-toggle text-muted mx-2 border-0 myBtn " style="cursor:pointer" onclick="myFunction('${comment_id}')"  >
                    Read More
                        </button>
                    
                </div>
    
            </div>`
            let commentElement = getElementFromString(string1);
            // console.log(parameterElement);
            box1.appendChild(commentElement)
        }
    }
}
