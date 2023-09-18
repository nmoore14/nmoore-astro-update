---
id: 1
title: 'RipGrep and FZF Powerhouse'
description: 'My favorite script for my development workflow'
pubDate: 'Sep 14 2023'
heroImage: '/images/blogs/rg-fzf-blog.png'
author: 'Nick Moore'
publish: true
---

## A little bit of backstory...

Over the past couple of years I have slowly migrated all of my workflow into the terminal, I still have a few things left to move, but overall I never leave the terminal. One of the main driving forces in this migration was performance and convenience. Currently I work on an older MacBook Pro and it is starting to show its age and when I started this move I was a heavy VSCode user. Unfortunately, I didn’t much care for the built-in terminal, so I would always have VSCode plus whatever terminal I was using at the time (iTerm, Alacritty, or Kitty). Then I would configure VSCode with a ton of plugins (I like learning and hacking around with new languages and frameworks) and extensions, so this really started to bog down my performance. I have used Vim in the past, but I wasn’t too thrilled with it at the time, but after some research and digging I found NeoVim. I’ll go into that setup and configuration in a later post if anyone is interested.

Once I moved my development work to NeoVim I was still missing some of the creature comforts that VSCode offered, autocomplete, suggestions, search, the whole 9 yards. I really liked some of the plugins that allowed me to search inside NeoVim, but I had to deal with projects and work directory set ups. Sometimes I just wanted to get an idea started to see if I could learn a quick skill and never touch that directory again. Doing this lead to me leaving around little bits of knowledge all over my computer.

## The realization...

Trying to find this knowledge left me scratching my head, I could use Spotlight or Raycast and find the files, but how am I going to open them in NeoVim? Then it dawned on me, just search from the terminal…pipe the result into NeoVim…start editing. Next issue, how can I do this? After a little digging, reading, trial and error, I came up with the following script.

## The resolution...
```bash
fr() {
  IFS=" "
  if [ $# -eq 0 ]; then
    # If no argument provided, prompt the user for a search query
    echo 'Please enter a string to search for'
    return
  else
    # Use the provided argument as the search query
    query="$1"
  fi

  # Get the selected file
  # Get the file and line number
  selected_file="$(rg --line-number \
    --with-filename \
    --field-match-separator ' ' \
    --color=always "$query" \
    | fzf --ansi \
    -d ' ' \
    --preview "bat --style=numbers --color=always --highlight-line {2} {1}" \
    --preview-window=right:'50%' --with-nth 1,2 --exact \
    )"
  read -r file_name line_number content &lt;<&lt; "$selected_file"
  unset IFS

  if [ -n "$file_name" ] && [ -n "$line_number" ]; then
    # Open the selected file in neovim with the specified line number
    nvim "$file_name" +"$line_number"
  else
    echo "No file selected."
  fi

}

```

This script allowed me to use [RipGrep](https://github.com/BurntSushi/ripgrep) to search for the string in the directory that I am currently in, pipe (pass) the results into [FZF](https://github.com/junegunn/fzf) and then filter the results even further. The cool parts are the flags for RipGrep and the action on select of the FZF output. I added `--line-number –with-filename` to RipGrep to give my results a little more meaning, this only gave me the filename, line number that the string was found on, and the line that the string was found on. When passed into FZF, I was able to filter it down even more and see a preview of the file. Once I press enter and select the result I would edit, it passes the path of the file and the line number directly to NeoVim. Passing those two options tells NeoVim the file to open and what line number to jump to. This gave me the ability to use my computer's search with RipGrep to find what I was looking for without it being restricted or bottlenecked by any program that the search was running in.
