export const uniquePeople = records => {
  let all = [];
  records.forEach(r => all = all.concat(r.people));

  const unique = [...new Set(all)]; 
  unique.sort();
  
  return unique;
}