const blogList = async (admin = false, s = 0, e = 20) => {
    let data = await fetch('https://api.benzenebots.com/posts/' + s + '/' + e)
    return await data.json();
};

const published_date = (published_date) => {
    let date = new Date(published_date)
    var given = moment(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()+1}`, "YYYY-MM-DD");
    var current = moment().startOf('day');
    var diff = moment.duration(current.diff(given)).asDays() + 1
    var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

    if (diff < 1) {
        return `Today`;
    }
    else if (diff === 1) {
        return `${diff} Day Ago`;
    }
    else if (diff <= 5 && diff > 1) {
        return `${diff} Days Ago`
    }
    else {
        return date.toLocaleDateString("en-US", options);
    }
}



const generateCards = async () => {


    let posts = await blogList(true, 0, 100)
    posts = posts.posts;

    posts.forEach((value, index) => {
        let id = value.id;
        let title = value.title;
        let category = value.category;
        let date = published_date(value.published)
        document.getElementById("blog-body").innerHTML += `
                <tr>
                    <td style="width: 70%;">
                        <span>
                            <a class="blog-list-link" href="/blog/post.html?id=${id}">${title}</a>
                        </span>
                    </td>
                    <td style="width: 20%">
                        <span>
                            <a class="blog-list-link" href="/blog/post.html?id=${id}">${category}</a>
                        </span>
                    </td>
                    <td style="width: 50%;"> 
                        <span>
                            <a class="blog-list-link" href="/blog/post.html?id=${id}">${date}</a>
                        </span>
                    </td>
                </tr> 
`
    })
}
generateCards();