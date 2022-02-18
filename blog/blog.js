const blogList = async (admin = false, s = 0, e = 20) => {
    let data = await fetch('https://api.benzenebots.com/posts/' + s + '/' + e)
    return await data.json();
};


const generateCards = async () => {
    let posts = await blogList(true, 0, 100)
    posts = posts.posts;

    posts.forEach((value, index) => {
        let id = value.id;
        let title = value.title;
        let category = value.category;

        document.getElementById("blog-body").innerHTML += `
                <tr>
                    <td style="width: 100%;">
                        <span>
                            <a class="blog-list-link" href="/blog/post.html?id=${id}">${title}</a>
                        </span>
                    </td>
                    <td>${category}</td>
                </tr> 
`
    })
}
generateCards()
/**/
