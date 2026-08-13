"use client";

// Bootstrap ListGroup styles a list.
// The second list is a list of links, so I add the action property.
// I need "use client" because React Bootstrap uses React context.
import { ListGroup } from "react-bootstrap";

export default function BootstrapLists() {
  return (
    <div>
      <div id="wd-css-styling-lists">
        <h2>Favorite movies</h2>
        <ListGroup>
          <ListGroup.Item active>Aliens</ListGroup.Item>
          <ListGroup.Item>Terminator</ListGroup.Item>
          <ListGroup.Item>Blade Runner</ListGroup.Item>
          <ListGroup.Item>Lord of the Rings</ListGroup.Item>
          <ListGroup.Item disabled>Star Wars</ListGroup.Item>
        </ListGroup>
      </div>

      <div id="wd-css-hyperlink-list">
        <h2>Favorite books</h2>
        <ListGroup>
          <ListGroup.Item action active href="https://en.wikipedia.org/wiki/Dune_(novel)">
            Dune
          </ListGroup.Item>
          <ListGroup.Item action href="https://en.wikipedia.org/wiki/The_Lord_of_the_Rings">
            Lord of the Rings
          </ListGroup.Item>
          <ListGroup.Item action href="https://en.wikipedia.org/wiki/The_Forever_War">
            The Forever War
          </ListGroup.Item>
          <ListGroup.Item action href="https://en.wikipedia.org/wiki/2001:_A_Space_Odyssey_(novel)">
            2001 A Space Odyssey
          </ListGroup.Item>
          <ListGroup.Item action disabled href="https://en.wikipedia.org/wiki/Ender%27s_Game">
            Ender&apos;s Game
          </ListGroup.Item>
        </ListGroup>
      </div>
    </div>
  );
}
