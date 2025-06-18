const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, current) => {
    return sum + current
  }

  return blogs.length === 0 ? 0 : blogs.map(blog => blog.likes).reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  let highestLikes = 0
  let favIndex = 0
  for(let i = 0; i < blogs.length; i++){
    if(blogs[i].likes > highestLikes){
      highestLikes = blogs[i].likes
      favIndex = i
    }
  }
  return blogs[favIndex]
}
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};