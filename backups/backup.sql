--
-- PostgreSQL database dump
--

\restrict QGBWTdHybOrZ1c9NeCqA3xlrBi4uGibegSRH5UH8BW4kxcxEMt2NcHSOe0VJKRP

-- Dumped from database version 16.13 (Debian 16.13-1.pgdg13+1)
-- Dumped by pg_dump version 16.13 (Debian 16.13-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: friendships; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.friendships VALUES (10, '5026bc04-e726-49ba-a308-572b72550352', '2026-05-04 01:25:43.284177', '2026-05-04 01:25:43.28418');
INSERT INTO public.friendships VALUES (11, 'eac94224-1094-4f60-b0ee-34e4ab94d961', '2026-05-04 01:25:43.288207', '2026-05-04 01:25:43.288211');
INSERT INTO public.friendships VALUES (12, 'd1f3bcd2-4519-4c0d-8420-843ad4bb7c16', '2026-05-04 01:25:43.290553', '2026-05-04 01:25:43.290555');
INSERT INTO public.friendships VALUES (13, '67438053-327f-4192-b8d3-63c972537d23', '2026-05-04 01:25:43.291958', '2026-05-04 01:25:43.29196');
INSERT INTO public.friendships VALUES (14, 'e30fa08c-745a-4f0d-879a-0a71ae457823', '2026-05-04 01:25:43.293213', '2026-05-04 01:25:43.293218');
INSERT INTO public.friendships VALUES (15, 'd0533709-2add-4bb9-bd57-95816a8039b7', '2026-05-04 01:25:43.294291', '2026-05-04 01:25:43.294293');
INSERT INTO public.friendships VALUES (16, 'e6d78b96-c2a0-4510-ba6b-74c13a0fc641', '2026-05-04 01:25:43.295735', '2026-05-04 01:25:43.29574');
INSERT INTO public.friendships VALUES (17, '4fe2c659-acdb-4522-8c2a-df8db912e9a3', '2026-05-04 01:25:43.297323', '2026-05-04 01:25:43.297325');
INSERT INTO public.friendships VALUES (18, '598948e5-bb08-4bf6-956d-52c7ae48422b', '2026-05-04 01:25:43.299425', '2026-05-04 01:25:43.299428');


--
-- Data for Name: hobbies; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.hobbies VALUES (9, 'Apple picking', 'c72df9eb-3fcd-4e84-a741-c11822966203', '2026-05-04 01:25:43.27917', '2026-05-04 01:25:43.279174');
INSERT INTO public.hobbies VALUES (10, 'Baking', 'eb132df5-2525-4cf4-b5d9-d88920245b13', '2026-05-04 01:25:43.279177', '2026-05-04 01:25:43.279178');
INSERT INTO public.hobbies VALUES (11, 'Flying', '20b6e6a5-e525-4269-b289-ee6c2cbeb703', '2026-05-04 01:25:43.27918', '2026-05-04 01:25:43.27918');
INSERT INTO public.hobbies VALUES (12, 'Gardening', '99f6dc8b-a0ee-4065-a643-3622c7354dc7', '2026-05-04 01:25:43.279182', '2026-05-04 01:25:43.279183');
INSERT INTO public.hobbies VALUES (13, 'Makeovers', '6f0e00ba-cf04-4625-89a2-665d8227cdfe', '2026-05-04 01:25:43.279188', '2026-05-04 01:25:43.279189');
INSERT INTO public.hobbies VALUES (14, 'Reading', '8b16291a-413f-4470-97fb-6cc6fa75bff2', '2026-05-04 01:25:43.279191', '2026-05-04 01:25:43.279192');
INSERT INTO public.hobbies VALUES (15, 'Singing', 'd768fc56-c9ab-4918-881f-3c898b03fe77', '2026-05-04 01:25:43.279193', '2026-05-04 01:25:43.279194');
INSERT INTO public.hobbies VALUES (16, 'Weather control', 'fa6fbff5-9bdc-4e72-b38f-7e0ccea06224', '2026-05-04 01:25:43.2792', '2026-05-04 01:25:43.2792');


--
-- Data for Name: friendship_hobbies; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: generations; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.generations VALUES (2, '11b97efa-6857-4191-9900-b6a6e7a97487', '2026-05-04 01:25:43.224566', '2026-05-04 01:25:43.224571', 'G4');


--
-- Data for Name: ponies; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.ponies VALUES (7, 'Fluttershy', 'uploads/a5c4ec60-40f9-4859-a3b3-ef63aa422646.jpg', 'b4a5a60a-bfea-45aa-98cf-57dc02558b8f', '2026-05-04 01:25:43.28166', '2026-05-04 01:25:43.281664', 2);
INSERT INTO public.ponies VALUES (8, 'Applejack', 'uploads/46bf4058-57e6-460c-85bc-e9f7ee7e27f0.jpg', '801cb3f7-d152-478c-9e25-1fb55a371aaa', '2026-05-04 01:25:43.281667', '2026-05-04 01:25:43.281667', 2);
INSERT INTO public.ponies VALUES (9, 'Twilight Sparkle', 'uploads/2bf6784a-cf00-4f77-9256-c0aeb71fede3.png', '0e4881fc-91b5-46d3-ad69-158a59340eef', '2026-05-04 01:25:43.28167', '2026-05-04 01:25:43.28167', 2);
INSERT INTO public.ponies VALUES (10, 'Pinkie Pie', 'uploads/6d099ec4-dda3-412d-9b62-1358a6b0fa70.png', '9832d4cd-c951-4ad3-8da7-6f2e095f1668', '2026-05-04 01:25:43.281672', '2026-05-04 01:25:43.281672', 2);
INSERT INTO public.ponies VALUES (11, 'Rainbow Dash', 'uploads/ebca509b-e8b3-44ae-a03f-dec03f841da4.png', '33efff45-4a65-4b82-b885-6ec476044df3', '2026-05-04 01:25:43.281674', '2026-05-04 01:25:43.281675', 2);
INSERT INTO public.ponies VALUES (12, 'Rarity', 'uploads/5e7f8ce9-2f22-49a7-9722-fa7540bbac61.png', '3117737f-d9ca-434b-bdc0-12621e6777ee', '2026-05-04 01:25:43.281677', '2026-05-04 01:25:43.281677', 2);


--
-- Data for Name: pony_friendships; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.pony_friendships VALUES (19, 10, 7, '5ed60919-99c2-4a0e-8cd4-9d9ccc1ffa22', '2026-05-04 01:25:43.289254', '2026-05-04 01:25:43.289257');
INSERT INTO public.pony_friendships VALUES (20, 10, 11, 'a5c8ffae-7f6b-4598-925f-69ad3a453f7a', '2026-05-04 01:25:43.28926', '2026-05-04 01:25:43.289261');
INSERT INTO public.pony_friendships VALUES (21, 11, 7, '39216335-9db5-43f2-9180-9a7acaf7a5da', '2026-05-04 01:25:43.29101', '2026-05-04 01:25:43.291013');
INSERT INTO public.pony_friendships VALUES (22, 11, 12, '8d8984b0-ce50-47ed-bb19-dc71c03e0b26', '2026-05-04 01:25:43.291016', '2026-05-04 01:25:43.291016');
INSERT INTO public.pony_friendships VALUES (23, 12, 7, '59ed07b9-495a-4401-abb0-57bac799d5e5', '2026-05-04 01:25:43.292338', '2026-05-04 01:25:43.292339');
INSERT INTO public.pony_friendships VALUES (24, 12, 8, 'af0a7ed1-4c5a-4a84-accb-c850a379ff2f', '2026-05-04 01:25:43.292343', '2026-05-04 01:25:43.292343');
INSERT INTO public.pony_friendships VALUES (25, 13, 11, '56e82ddb-d531-4065-a00e-403650bf4fb4', '2026-05-04 01:25:43.293649', '2026-05-04 01:25:43.293651');
INSERT INTO public.pony_friendships VALUES (26, 13, 8, '382fd3e8-0052-480f-ab0b-7b1cccd5f54c', '2026-05-04 01:25:43.293653', '2026-05-04 01:25:43.293654');
INSERT INTO public.pony_friendships VALUES (27, 14, 11, 'c3591d13-847a-478b-ac60-ba9622f14322', '2026-05-04 01:25:43.294624', '2026-05-04 01:25:43.294625');
INSERT INTO public.pony_friendships VALUES (28, 14, 9, '622aa5f8-4961-47fb-b9c7-3f4c0ac4cef3', '2026-05-04 01:25:43.294628', '2026-05-04 01:25:43.294629');
INSERT INTO public.pony_friendships VALUES (29, 15, 12, '3632ad05-37e3-43c1-9aac-0cbcc741cb30', '2026-05-04 01:25:43.296389', '2026-05-04 01:25:43.296393');
INSERT INTO public.pony_friendships VALUES (30, 15, 9, 'da9418d8-bd8e-4671-ad8a-4c45b680e689', '2026-05-04 01:25:43.296397', '2026-05-04 01:25:43.296397');
INSERT INTO public.pony_friendships VALUES (31, 16, 12, '5e151d9c-ebfc-4b08-af97-4337a1cb083b', '2026-05-04 01:25:43.297872', '2026-05-04 01:25:43.297876');
INSERT INTO public.pony_friendships VALUES (32, 16, 10, '7a6237cf-44a4-485a-bd7f-3ebcef326567', '2026-05-04 01:25:43.297878', '2026-05-04 01:25:43.297879');
INSERT INTO public.pony_friendships VALUES (33, 17, 8, '63aa02da-244f-482c-8979-2f8a2c4556aa', '2026-05-04 01:25:43.299859', '2026-05-04 01:25:43.299861');
INSERT INTO public.pony_friendships VALUES (34, 17, 10, 'c629f3c0-22aa-4698-a700-68921754f139', '2026-05-04 01:25:43.299864', '2026-05-04 01:25:43.299864');
INSERT INTO public.pony_friendships VALUES (35, 18, 9, '84c534fe-03af-413a-b6c9-7a1202ee1129', '2026-05-04 01:25:43.300559', '2026-05-04 01:25:43.300561');
INSERT INTO public.pony_friendships VALUES (36, 18, 10, 'a97e4c7d-b530-45f7-a340-a24e23b6753f', '2026-05-04 01:25:43.300565', '2026-05-04 01:25:43.300565');


--
-- Data for Name: pony_hobbies; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.pony_hobbies VALUES (22, 7, 12, '833ef9ce-a2b2-4d64-aa14-a4bc4f2f040d', '2026-05-04 01:25:43.285782', '2026-05-04 01:25:43.285785');
INSERT INTO public.pony_hobbies VALUES (23, 7, 15, '07052fd7-eb20-4ed8-89f2-0bfdeead0288', '2026-05-04 01:25:43.285788', '2026-05-04 01:25:43.285788');
INSERT INTO public.pony_hobbies VALUES (24, 7, 13, 'fc966fc7-c285-4ca2-ac30-bcd43ac47ba4', '2026-05-04 01:25:43.28579', '2026-05-04 01:25:43.285791');
INSERT INTO public.pony_hobbies VALUES (25, 8, 9, '0b716079-57ea-4712-a024-1d62a50439c8', '2026-05-04 01:25:43.285793', '2026-05-04 01:25:43.285793');
INSERT INTO public.pony_hobbies VALUES (26, 8, 10, '1e7b295b-aea0-46ca-a50c-6cc36e8db7f7', '2026-05-04 01:25:43.285796', '2026-05-04 01:25:43.285796');
INSERT INTO public.pony_hobbies VALUES (27, 8, 12, '62983e0d-96fe-48b4-a5d6-41baa3af588e', '2026-05-04 01:25:43.285798', '2026-05-04 01:25:43.285798');
INSERT INTO public.pony_hobbies VALUES (28, 9, 14, '1b298cb5-94c4-4e47-863a-80a9cd0a497f', '2026-05-04 01:25:43.2858', '2026-05-04 01:25:43.2858');
INSERT INTO public.pony_hobbies VALUES (29, 9, 10, '14724775-83fa-406a-9a13-1b63a34e58db', '2026-05-04 01:25:43.285802', '2026-05-04 01:25:43.285803');
INSERT INTO public.pony_hobbies VALUES (30, 9, 12, 'd04f85a9-66fe-420a-a0a9-f8dbfad10da3', '2026-05-04 01:25:43.285804', '2026-05-04 01:25:43.285805');
INSERT INTO public.pony_hobbies VALUES (31, 9, 15, '956d4b9b-e928-4c94-a296-3c06e923bcf4', '2026-05-04 01:25:43.285807', '2026-05-04 01:25:43.285807');
INSERT INTO public.pony_hobbies VALUES (32, 10, 10, 'fbfc667d-3c47-4e90-af9c-b3da3297a54b', '2026-05-04 01:25:43.28581', '2026-05-04 01:25:43.28581');
INSERT INTO public.pony_hobbies VALUES (33, 10, 15, '50bd2a37-c184-4fdc-9e4f-d8b290791e3d', '2026-05-04 01:25:43.285812', '2026-05-04 01:25:43.285812');
INSERT INTO public.pony_hobbies VALUES (34, 10, 13, '1d06cee8-517b-44f6-bab5-f9c2f2ea075b', '2026-05-04 01:25:43.285814', '2026-05-04 01:25:43.285814');
INSERT INTO public.pony_hobbies VALUES (35, 11, 11, 'b5e15f70-910e-4962-954b-9d9d33d0c906', '2026-05-04 01:25:43.285816', '2026-05-04 01:25:43.285817');
INSERT INTO public.pony_hobbies VALUES (36, 11, 16, '71cb8eb3-f85b-4489-a993-f7a6568b6fdb', '2026-05-04 01:25:43.285818', '2026-05-04 01:25:43.285819');
INSERT INTO public.pony_hobbies VALUES (37, 11, 15, 'b0024d5d-1813-437a-a119-767fc65c6829', '2026-05-04 01:25:43.28582', '2026-05-04 01:25:43.285821');
INSERT INTO public.pony_hobbies VALUES (38, 11, 14, '2dcfe7ce-b584-4261-8880-adf0e509abb3', '2026-05-04 01:25:43.285823', '2026-05-04 01:25:43.285823');
INSERT INTO public.pony_hobbies VALUES (39, 12, 13, '63dd5162-5f40-44d4-90ed-523fe1394fc4', '2026-05-04 01:25:43.285825', '2026-05-04 01:25:43.285825');
INSERT INTO public.pony_hobbies VALUES (40, 12, 15, 'd36996a3-a10e-4971-8abc-ae3c5b40f5ce', '2026-05-04 01:25:43.285827', '2026-05-04 01:25:43.285827');
INSERT INTO public.pony_hobbies VALUES (41, 12, 14, 'a8b49fee-db73-4270-a348-577e1a22b46a', '2026-05-04 01:25:43.285829', '2026-05-04 01:25:43.285829');
INSERT INTO public.pony_hobbies VALUES (42, 12, 11, '1d4a804d-227d-49d6-9efc-fecabe4ca492', '2026-05-04 01:25:43.285831', '2026-05-04 01:25:43.285832');


--
-- Name: friendship_hobbies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.friendship_hobbies_id_seq', 1, false);


--
-- Name: friendships_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.friendships_id_seq', 18, true);


--
-- Name: generations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.generations_id_seq', 2, true);


--
-- Name: hobbies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.hobbies_id_seq', 16, true);


--
-- Name: ponies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ponies_id_seq', 12, true);


--
-- Name: pony_friendships_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pony_friendships_id_seq', 36, true);


--
-- Name: pony_hobbies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pony_hobbies_id_seq', 42, true);


--
-- PostgreSQL database dump complete
--

\unrestrict QGBWTdHybOrZ1c9NeCqA3xlrBi4uGibegSRH5UH8BW4kxcxEMt2NcHSOe0VJKRP

